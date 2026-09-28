"use client";

import {
  useEffect,
  useRef,
} from "react";
import {
  usePathname,
  useRouter,
} from "next/navigation";
import { supabase } from "../lib/supabase";

const LOGIN_EXPIRY_KEY =
  "customer_login_expires_at";

const ONE_DAY_MS =
  24 * 60 * 60 * 1000;

export default function AuthSessionGuard() {
  const router =
    useRouter();

  const pathname =
    usePathname();

  const timerRef =
    useRef<
      ReturnType<
        typeof setTimeout
      > | null
    >(null);

  useEffect(() => {
    let active = true;

    const clearTimer = () => {
      if (
        timerRef.current
      ) {
        clearTimeout(
          timerRef.current
        );

        timerRef.current =
          null;
      }
    };

    const redirectAfterLogout =
      () => {
        const currentPath =
          window.location.pathname +
          window.location.search;

        if (
          pathname.startsWith(
            "/account"
          ) ||
          pathname.startsWith(
            "/checkout"
          )
        ) {
          router.replace(
            `/account/login?redirect=${encodeURIComponent(
              currentPath
            )}`
          );

          return;
        }

        router.refresh();
      };

    const logoutExpiredSession =
      async () => {
        clearTimer();

        localStorage.removeItem(
          LOGIN_EXPIRY_KEY
        );

        await supabase.auth.signOut();

        if (!active) {
          return;
        }

        redirectAfterLogout();
      };

    const scheduleExpiryCheck =
      (
        expiresAt: number
      ) => {
        clearTimer();

        const remaining =
          expiresAt -
          Date.now();

        if (
          remaining <= 0
        ) {
          void logoutExpiredSession();
          return;
        }

        timerRef.current =
          setTimeout(() => {
            void logoutExpiredSession();
          }, remaining);
      };

    const checkSessionExpiry =
      async () => {
        const {
          data: {
            session,
          },
        } =
          await supabase.auth.getSession();

        if (!active) {
          return;
        }

        if (!session) {
          clearTimer();

          localStorage.removeItem(
            LOGIN_EXPIRY_KEY
          );

          return;
        }

        const storedExpiry =
          Number(
            localStorage.getItem(
              LOGIN_EXPIRY_KEY
            )
          );

        const expiresAt =
          Number.isFinite(
            storedExpiry
          ) &&
          storedExpiry > 0
            ? storedExpiry
            : Date.now() +
              ONE_DAY_MS;

        if (
          !storedExpiry
        ) {
          localStorage.setItem(
            LOGIN_EXPIRY_KEY,
            String(
              expiresAt
            )
          );
        }

        if (
          Date.now() >=
          expiresAt
        ) {
          await logoutExpiredSession();
          return;
        }

        scheduleExpiryCheck(
          expiresAt
        );
      };

    void checkSessionExpiry();

    const {
      data: {
        subscription,
      },
    } =
      supabase.auth.onAuthStateChange(
        (
          event,
          session
        ) => {
          if (!active) {
            return;
          }

          if (
            event ===
              "SIGNED_OUT" ||
            !session
          ) {
            clearTimer();

            localStorage.removeItem(
              LOGIN_EXPIRY_KEY
            );

            return;
          }

          const storedExpiry =
            Number(
              localStorage.getItem(
                LOGIN_EXPIRY_KEY
              )
            );

          const expiresAt =
            Number.isFinite(
              storedExpiry
            ) &&
            storedExpiry > 0
              ? storedExpiry
              : Date.now() +
                ONE_DAY_MS;

          if (
            !storedExpiry
          ) {
            localStorage.setItem(
              LOGIN_EXPIRY_KEY,
              String(
                expiresAt
              )
            );
          }

          scheduleExpiryCheck(
            expiresAt
          );
        }
      );

    const handleVisibility =
      () => {
        if (
          document.visibilityState ===
          "visible"
        ) {
          void checkSessionExpiry();
        }
      };

    const handleFocus =
      () => {
        void checkSessionExpiry();
      };

    const handleStorage =
      (
        event:
          StorageEvent
      ) => {
        if (
          event.key ===
          LOGIN_EXPIRY_KEY
        ) {
          void checkSessionExpiry();
        }
      };

    document.addEventListener(
      "visibilitychange",
      handleVisibility
    );

    window.addEventListener(
      "focus",
      handleFocus
    );

    window.addEventListener(
      "storage",
      handleStorage
    );

    return () => {
      active = false;

      clearTimer();

      subscription.unsubscribe();

      document.removeEventListener(
        "visibilitychange",
        handleVisibility
      );

      window.removeEventListener(
        "focus",
        handleFocus
      );

      window.removeEventListener(
        "storage",
        handleStorage
      );
    };
  }, [
    pathname,
    router,
  ]);

  return null;
}
