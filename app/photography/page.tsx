'use client'

import React, { useState, useEffect, useCallback, useRef } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'motion/react'
import Backdrop from '@/components/backdrop/pattern'
import PageHeader from '@/components/page-header'
import { useHighlight, useStick } from '@/lib/motion/pointer'
import { useScrollLock } from '@/lib/motion/scroll-lock'

/**
 * Every photograph, newest first.
 *
 * The order is each file's EXIF DateTimeOriginal, not the upload order and not
 * the filename: the folder holds three naming schemes from different cameras,
 * so filenames only sort within one device. Adding a photograph means reading
 * its date and putting it in order, which for anything new is the top.
 */
const PHOTOS: [id: string, taken: string][] = [
  ['191YhV1m1ogVz2SHgl4b1ynQqMrsmJlRU', '2026-10-09'],
  ['1EY9pmipkBG5c7z88oCJuoc3rTyU8fPPg', '2026-10-09'],
  ['12JoUzstxh2lxK_QHaOUpq-CIVW09sQUl', '2026-10-09'],
  ['1E5cughZ6wG5siQMCJ_rP2oFk1t1_4o4g', '2026-10-02'],
  ['1G6DUj49f9kQt5Acaz23b9_Ox8GHoxFB3', '2026-10-02'],
  ['1dWVKvN7EXFjnLhFbZNEXgpUSZBZr4hNt', '2026-09-29'],
  ['1usRkUQiakNTrRhVpP8_gM7L-AuDrXA8k', '2026-09-08'],
  ['1bFDWI9O4D8errlm3AVOg5GmqLUMLGVRS', '2026-09-08'],
  ['1NSA_D9T97m14ypvjy347UBbFVJg7gPZA', '2026-09-08'],
  ['1b0hjzwyoVeLzMCx_5G6rMIghZYW9oceA', '2026-09-08'],
  ['1mKxKKYpATSB39KjIOQn4GBQHfLIgGbAP', '2026-09-08'],
  ['1J601MVnDGkTcZ7YfAYa65AqNkDNIiDXR', '2026-09-08'],
  ['141L4hIjSdwTjvufb25vgaNp-FYRyM8Ke', '2026-09-08'],
  ['1GQ1-ybVDcwlen-f3Axf6v0yq3omH3dn-', '2026-09-08'],
  ['1hhTY-RRlSZX520F-NAR3VL_-1pXtVO4L', '2026-09-08'],
  ['1a9pfMZajKqCzeBctcdUQwT7Ad7DeIQos', '2026-09-07'],
  ['1BRCEGC7O-tWXQxxZv6V2uo1Qys0zya6E', '2026-09-07'],
  ['1IGIxdD2HKy2OqHecfRjkgcMkbfkxeRJL', '2026-09-07'],
  ['1SZ7re4fWXvQISfeDh6lNlsgsguTV6-uJ', '2026-09-05'],
  ['1Rtf8iYt-4dUpY7Yt8QGkln2p2jan-nyg', '2026-09-05'],
  ['1fwgTtvhZmY9nqQvNj9MfmJ-TbnzAY-cL', '2026-09-05'],
  ['1wzFK2CLpmyIyboB4f04R5axLLYSl_wTd', '2026-09-05'],
  ['1mssUdyQ9n1mA0niELpOiS3WvKwncwBP5', '2026-09-05'],
  ['19B_iVL5tvFZUiJofQBkQLfq3xCU_GxzZ', '2026-09-05'],
  ['1JXSJ4IkDuKdhK0R53Z0z298BnKK6TlTa', '2026-09-05'],
  ['1IebeNtzdnpMiikGS3Q3r5ilaozJimJca', '2026-09-05'],
  ['1pS-fBSDl_XR8b-C0DfI6XL6KxP76KGI-', '2026-09-02'],
  ['1Hp89NjUsqIA_fSvksgFK2O_Yh5W8fNSG', '2026-09-02'],
  ['10Tu9fskOeGwtJrNio1TV5CJD4lOzjdJ-', '2026-09-02'],
  ['1-tBOGv8K8JT5Wi3NAUkC5_B9Jpgyp0TY', '2026-09-02'],
  ['1Gg8R7WIewZXVmUL9Sy3pOEvaYMrMLSC-', '2026-09-02'],
  ['1qH9AKXpmqu0V_UeZOAZ_7W-zPMqRkXL0', '2026-09-02'],
  ['1Jfak-PhtrPJo4tcLR5ZLOZFvSM48A76V', '2026-09-02'],
  ['1KJOBVXUvGSWVvPEkeBG6e8MxZt3KytXb', '2026-09-02'],
  ['1iwVIZrhwCfHP9LsD8w9fnQnk_I4qV6IP', '2026-09-02'],
  ['1tY9O4G8dmNqiwCCa8b53A3KH4vQ3mJlU', '2026-09-02'],
  ['18tVgZbhlm1ivcbRa_jcwqC9bUFv4hUpw', '2026-08-31'],
  ['1v0zyusLxZ445jHlyXo9MLFExcHTDftIt', '2026-08-30'],
  ['1OVskoHurg6OzBIj0OLhyKqCNnE83k-ln', '2026-08-30'],
  ['1FGVuwRf78erOpS1JVRnUkUhDwkXh_12Q', '2026-08-30'],
  ['1KJthOznMoqZdg7syrq4cKXrEHQcsnxyi', '2026-08-30'],
  ['15znt1yavybb-q-H7EflPKhYQKiWN0uF5', '2026-08-30'],
  ['18Zani2-Zl-ZlUVAu0aE2o396S6wSp6El', '2026-08-30'],
  ['1WPx4lgE5zlgQerSsDLzBGMwlOz_EWrhf', '2026-08-30'],
  ['1vtKdxH2P81BNIfVV0rLGbTzCaoHgsM9_', '2026-08-30'],
  ['1vOGqXfNLJLZ8zLG-bXUdpyC34R4zV8iy', '2026-08-30'],
  ['169z6zGqfKlTsC6u0IP-dVZIWylOVyk9W', '2026-08-09'],
  ['1OUSSZkY74a2DrK0t1TUBhsKWUIEacFmS', '2026-08-01'],
  ['1Y7uQicIhXCC0xVSN-rCXm-EkBgk2Zuss', '2026-08-01'],
  ['1ZglCrsFpahV8GYsZih7l0yACJjbQ6Ydi', '2026-08-01'],
  ['1VNHo5mR1JckQs27V9Wpkxy8MJyS3uu_Q', '2026-08-01'],
  ['1xVxXPBQ1rxfvosY-_KaKJlMIwY8hTzPl', '2026-08-01'],
  ['1IoIkBQkbkYakcLLhHJe6YwSrTXDj3RPM', '2026-08-01'],
  ['1hFQIVEgcrQ2fqpOgQusLHjQIxa0WKF7B', '2026-07-31'],
  ['1CLQEnwVl-GnnM9fPZr9pgnFtCaLz8_eW', '2026-07-31'],
  ['161czfFB74p1yTMWeioLscs7_a7_ThHJS', '2026-07-27'],
  ['1sKu2WzBc22uELXOYww7XFuv1azKO-1GY', '2026-07-27'],
  ['1JtX5Uz4-JYVNpO29CsG-9pt6DtpBjzpl', '2026-07-26'],
  ['1CB54WvFLmI62losg3rTQPczalfYaj2do', '2026-07-26'],
  ['19X6x1Dq4Ouq3gsVLoju-jHkjqCqGJN8j', '2026-07-26'],
  ['1OfkuQ9XGxuEj-mXSu767rzlascfj5o5g', '2026-07-26'],
  ['1RV7FlCfd_b3vZZVpBA_LfPYDDTcNUhBI', '2026-07-26'],
  ['1zEd65xQQS6vT4tm8rOqqHDZejuA_KWb4', '2026-07-26'],
  ['1PM2Omkap-LE7T9CMHEhzjUGtLd0xnyye', '2026-07-26'],
  ['1K9gkIsBTEH9QfHIKWskYSLn-FUztFyym', '2026-07-24'],
  ['1P0tDB-PMkmMSLvVSWDw78uMdaYXZ2V90', '2026-07-24'],
  ['1llOk6pk6_d5mBARPqsnMPYHGC6uqY2wr', '2026-07-19'],
  ['1bOJwYwGIFy2VNopBah2fvXyeBUHRA7ty', '2026-07-19'],
  ['1MnNUQgP0r2gCoz0eL2MKmW5FOsFAyIaS', '2026-07-19'],
  ['163OVASGfgOJED2NoO9_sy1tu5LpQl6ft', '2026-07-19'],
  ['1xb5YzZ_KcO9fZt9lyht8fr5ygoSE6VqE', '2026-07-19'],
  ['1r8XkdGrAgyKxmZBAuDxUDxGcbagPF0Po', '2026-07-19'],
  ['1meLlpZSfyB0rYBfpNy405ExZWZofuBGl', '2026-07-19'],
  ['1HXqd53mj0ap6bjLKI9grvtER3DHADokL', '2026-07-18'],
  ['1icnr44XNkB8ExwMTkuJEDWWYYVN7_qTF', '2026-07-18'],
  ['1c72xgJuLy3IMH6cl8Fnxnr2xn7eFSZo_', '2026-07-16'],
  ['1pu0jzMdO37syY0RSFQFUiGX3fMsV0aDo', '2026-07-16'],
  ['1uDCI6wjXmyUbtbmA83rX9_ePAzn2uAxu', '2026-07-16'],
  ['1IG69xAgmYpUbfn0MCXfGoSNdl7pcfFNH', '2026-07-14'],
  ['1JiTuPnm-ReGrdQEaH4JI3UwagQ9z-NHE', '2026-07-14'],
  ['1XWAav1SHFDE0MOozzPgNb06iVyN-Sw14', '2026-07-14'],
  ['12_9JJlStiT9DJgkQ4RYLxhllWf18Dwx2', '2026-07-14'],
  ['1gg_MLUHTj57vW1VZnwTdM_IywwTm5PNo', '2026-07-14'],
  ['1zv-D-AsOaqCP4QR58FaOjxXxmE3fHCuY', '2026-07-14'],
  ['15LH6sAQQIaARcDlTY0_G_xm3EleWfTIy', '2026-07-14'],
  ['10LtzRMlRtqr00I7SHBLImMuAZcWiwZ4q', '2026-07-12'],
  ['1l-SvtSqDIWStEHsnvGwVrFtB5HN1hx1y', '2026-07-12'],
  ['1nYP7wYtVAlEKrfh8pKUSbkVRqyb5aqHF', '2026-07-12'],
  ['15tfjae_JYVctCrWO9JACtj42ZMMq3Xy9', '2026-07-12'],
  ['1RKg4hKCwsWlDSGz-M9uRuaFWhoiRL3A8', '2026-07-12'],
  ['1wO4UnPYuQ7Q5zMrt5HUUzUSz7mKtTGDv', '2026-07-12'],
  ['1jQgWKMgWdvnHrt_CwOhFg7jaw4XXBW3I', '2026-07-12'],
  ['1Aj490GKcv4DIcL04-I8wyvyu2XwsUQ6P', '2026-07-05'],
  ['1ki97Sc1bW4ilrpo0qa3y_9t82ft9zSx7', '2026-07-04'],
  ['1TFbuyWZVeCr5e0vzfaVp2YaNM_9E2ZsH', '2026-07-03'],
  ['1dYHg1cne09VRlxePPpOHE_NkxyHV3ZRL', '2026-07-03'],
  ['17txU3AONl3FHiLOYtn5Pbyk6XxmbHYQX', '2026-07-03'],
  ['1zv75x8OC3L9ZUGTEdw5bww4U8kdQc2n1', '2026-07-03'],
  ['11tfj5pGejs9wvH6lMTyTLmKlYTEwIXiV', '2026-07-03'],
  ['1-WVP6Q1thJOGKYtTjH11UntiOkTJ261c', '2026-07-03'],
  ['1vCrZkxIOR6l18Jf4xLx4yZCSRbYsc9ED', '2026-06-28'],
  ['1E1dx_-yu307Fq5pQVqAtSqyBkES676uD', '2026-06-28'],
  ['1sLkmKnlZUO98-QiDbbuufATFLHXG2jBw', '2026-06-26'],
  ['1IyY-UEyEae9D9cegrlTfWNJRF8LkNKvH', '2026-06-26'],
  ['1TFuUJUCN79otHUb14FZ2e16nAKg88Il_', '2026-06-26'],
  ['12q8M8HiSuuBk2PaTJe91vlKg6gyl13q8', '2026-06-26'],
  ['1J2MMRGxbns4B-mPDHWP_3RkMddXM8cKM', '2026-06-26'],
  ['11xpUdgfpBel271fPEYkcZM-L6k2TkvwH', '2026-06-26'],
  ['1-X07outU5MskfbGcLu_t-tWxa_tkHtJu', '2026-06-25'],
  ['1tzfs_zRd-5pnQDvYOPKdXh6VafYon4Mt', '2026-06-25'],
  ['1AjT01b3iL4aDq42ZyduKyZ2P-Xd1DRwK', '2026-06-25'],
  ['14Yangjf1G32xIxXtH6SFyOTRI7OETnmL', '2026-06-25'],
  ['1KcvdKbIcODJzRC8NwEdtamc7OdpO9OSx', '2026-06-25'],
  ['1VNiQe531Il2gxiDWTPuquwvB-m0ylgYS', '2026-06-25'],
  ['1Hi9M7DSMBti1zi_3weTR50q1FyKWqKhj', '2026-06-25'],
  ['1wkObXrIcSGS2XYpWPioJwrS4damXGRjv', '2026-06-25'],
  ['1XcNIzTmNrtkomKoppJsLMEjTcENUfz1B', '2026-06-06'],
  ['1vcAxfwY_wW3NSN8Tx6YM5Zp91x5TXxuH', '2026-06-06'],
  ['1DrxqKOTs-rP1FHLavu0QRO3rvUo-YYft', '2026-06-06'],
  ['1TgEiSjiJ57WROzT5OXQobpXfLy86b3HZ', '2026-06-06'],
  ['1qOmAoPLTr8OqyQvxhgW1auXF8epvXMER', '2026-06-06'],
  ['1mojGkH2gkD0gzjRI3MflunB3b9SWSYuK', '2026-06-06'],
  ['18gGBC9WuReuNllqISRUTSU0MHb5AMr_b', '2026-06-06'],
  ['1PkpfwXJYruM5y_yY9ipzgK4Q29Klzk1X', '2026-06-06'],
  ['1shsjqOuaQEzSocBdXGp2FCSBjkYcvc3i', '2026-06-06'],
  ['1PhNBab_5paap_X27Gj-xPYJTXmQ2I2Bj', '2026-06-06'],
  ['1ZQ2tLOnzAJ0PU8ZpnB0YG_b2qg95mJBx', '2026-06-06'],
  ['1J41akVBClrF3zsSIgpEvCbKXjT-jUZaG', '2026-06-06'],
  ['17IB6cMe6DUovEqUpZQzaF2VfkNlvhGSN', '2026-06-06'],
  ['1_hkbv8vKqNGhm2A37DZUNW69TY_4VNiH', '2026-06-06'],
  ['1fY2LUq71zCsLdMYmcMFQ5dXwysX-1whs', '2026-04-26'],
  ['12suoU7RqSQKAirCP6fpzBHA1xSFo-jHq', '2026-04-26'],
  ['1JYWgcdUY6G5_t2kwmp_rC99m2XT8wlSd', '2026-04-14'],
  ['1E76wkocDML-PoacKeDIkrk6dfOC5BpNJ', '2026-04-12'],
  ['149t-uHElQnZygnWnls82WqnP3BvTQUm-', '2026-04-12'],
  ['1Y8LygAsLrMXHEjz4ESPy2wLdCKyXaVbH', '2026-04-12'],
  ['1Ik4CYa57TVpehAjVVrhy66FXr8QghIpU', '2026-04-12'],
  ['1Nuq4uw2N-hbmLp62Ask_eN_2pKVYYI7a', '2026-02-21'],
  ['1rbsoWCNdu9M0eawqrnjIVnd31RWmJeak', '2026-02-20'],
  ['1c9tdwkNl_o0g_Khyl1AR6tIciiPykKzO', '2026-01-14'],
  ['17SntI85XoE20Hz3el4Ysdz9J4VnRapNx', '2026-01-14'],
  ['1qCOHPIwTNhsFv2RDgeGeKbwIgYWP82VV', '2026-01-14'],
  ['1YT20UxJMPH1M711uCjZjkgj_anB5e1KX', '2026-01-12'],
  ['1nrIXyQvy1CbpV8p-LhcYTHR-V4RWGdaQ', '2026-01-12'],
  ['1lpUjBJnJl9iqp_CHbGQBBkCpDjRtoINm', '2026-01-12'],
  ['1glGvSBX_0StOKV5gl6ITbSCULGdPS1x6', '2026-01-12'],
  ['1FL-cmoPNxPAxMOSelAucR-3Za6VsvuJG', '2026-01-12'],
  ['1kXfeeSn74G7NKEfOZQt0wXGS4lKzSuZi', '2026-01-12'],
  ['1SuL8U6ks64BxWmpSlrTgGLFoevvxrfyk', '2026-01-12'],
  ['1FhND_7GSEbdO3jTCQoQYQBAUZLQjVshW', '2026-01-11'],
  ['19-ZbkWYTSG7a22wFzzM2f0KebhJV9DWp', '2026-01-11'],
  ['1wQPKYPWMTOCz_ZsbH8avw_2CuG8IHqbM', '2026-01-11'],
  ['1vitDhV0UO_PWuvg-FWaIs12KyUsj0qsP', '2026-01-10'],
  ['1CozUpgCsA9toMtzvr06An_bQ4IFVHPuW', '2026-01-10'],
  ['115cklbmCjlXFlteF-cUKKCB0W-LqgZIu', '2026-01-10'],
  ['1N-QDjnKbjtcXLm7pSHopLjdeS_3Ky_Vr', '2026-01-10'],
  ['1asrp79H4l6iQicTjTaEH1UTr8GEVRC5J', '2026-01-10'],
  ['1Tk6T8vtMSEuDVRSYLi_xAjDYEqX7hwKS', '2026-01-09'],
  ['1wSDrS5Y0nH8tGri6euVYTBy3xFdj6vhX', '2026-01-08'],
  ['1BQFmOd--edC08LaciNZXS1UyAflCOm4G', '2026-01-08'],
  ['18t9hNtugspICYdsceuY7Qb06nWOk-5IU', '2026-01-08'],
  ['1ZfRnwswiyrby7n5gs6cITN4C2QbXj7VP', '2026-01-08'],
  ['1eznA4HGD3NK9uARm6Qu4YtmHERC54lLo', '2026-01-08'],
  ['1Xsoy5MzVOKz3AhuHE6uNTGgEpVVUkxbb', '2026-01-08'],
  ['1ZzF-96qehDXlfVa2lMnEHkirNZnaMlcK', '2026-01-08'],
  ['1c6uL7ep4FbCZW8n4b6aIqmTQFq4-jrAI', '2026-01-08'],
  ['1FDiOZuWgxoTg346bKXLlMn0Pcw5pUwTU', '2026-01-06'],
  ['1pJWurlsVjqfjpMYw8k2zC9Ag14HC5Vtq', '2026-01-06'],
  ['1653mbYuN8Wjx-PKP9dOqKP54McbMYQzs', '2026-01-06'],
  ['1ZdEA03T8nJIJ9IbhSZeScpwCPqzK46mS', '2026-01-01'],
  ['1wQhro8LEufTE_IdaJwG8aihpWSjLGaQw', '2025-12-24'],
  ['1PHYvILuFESvXyqByw2c2d72YXscdyZk1', '2025-12-24'],
  ['1OFfkrsrPD4XGPU7hBq5xl8vLzeiB3_uO', '2025-12-24'],
  ['1g9XCClmAOZlqMlKmV8CRjxiib3fKIDDX', '2025-12-24'],
  ['13ANpbjrDR8A9jUnk3vdXng336Du_9Iyi', '2025-12-24'],
  ['1N8VlkCinSs39SADdf6KxD06chJCdRW2X', '2025-12-24'],
  ['1Ena6hRxb8j3tYjFKY1c1X6BU11A1JYKH', '2025-12-24'],
  ['10QHg4W5mlhC3KL9tW4fSbCKc9RHsA6J6', '2025-12-24'],
  ['1EDoP74ki_O3-VFON1wairdloPNKz5an8', '2025-12-08'],
  ['1kTdWvKFmd-KMMjj51xgmY4FKSzWPaMGr', '2025-10-19'],
  ['1A6Br5lOacnQkFFFOBYh6fjdKq8-7tsF3', '2025-07-06'],
  ['15CZ5JjCuHHDJ0OXNqUxC7gMx_a2oeFsK', '2025-07-05'],
  ['16LsZRyR3Ssi16H-sk7jIzf9sPnuG1TK3', '2025-07-03'],
  ['1iSZN6E_NGRyUFuF-7g7wSwZRf-cuP2TK', '2025-07-03'],
  ['1WCts8vIRjVpwLW_iMcfGXp0UUVb1jfdL', '2025-06-21'],
  ['1bYs0jkIVrLhvsr7r8ujBsSmS797yxVjc', '2025-06-07'],
  ['1DaWxfoi4zYKIMFWqZqyRaNVaG0X4msOP', '2025-06-07'],
  ['1dU5qR1KbInXy4uEEMYRbXO7Jax2Nczvr', '2025-06-07'],
  ['1_dHQSwVDZgndRygcA1HEib0q6r2K9mB8', '2025-06-07'],
  ['1OQQD_U70YqAfor_ERA5qDa1O3QxwYVNy', '2025-06-03'],
  ['1O5A3vVXf5yIoma3-I5usdhEl7QObO48u', '2025-06-03'],
  ['19IXcTY0Hwa0-N6Jwg2sOparh1RTvI5UA', '2025-01-11'],
  ['1O72e5yXuHme19hPPEIY92kZ0j0aN-BwV', '2025-01-11'],
  ['1i93AY3SHZNVlmhZMfwLdgmtH_Ja63DJy', '2025-01-11'],
  ['1l79MkePW5JzNbg6dLKYT0JbLDhejTGoh', '2025-01-10'],
  ['1Adws50gO9H9OaI3bNECRM0pg8V8gP2Y9', '2025-01-10'],
  ['1orHgPexhiL6HRajOXJhAmnOgwyBfjVYK', '2024-12-30'],
  ['1qEQyD4FQT6H3gSYPCbXkado9Z4Hn4lQt', '2024-12-30'],
  ['1I4-MxcTFhqyCi8ryz45EZogD7rSfe_9d', '2024-12-30'],
  ['1XjW9AtjhwgXeZqUfd6bghGKADlJtq7rp', '2024-12-30'],
  ['1fVb7U7GRdWW0SQq6zqp_ly6-iKvRGP9i', '2024-12-22'],
  ['1zJDhf81dcNUlPgltnFjvs1kNmiag1ZqI', '2024-12-22'],
  ['1rKToFYef0Zg7AHyCzur6FCGODdKzoEgS', '2024-12-21'],
  ['1DzRVfOkwkCyfu1im2qmUFtjVLgt6dY20', '2024-12-20'],
  ['1SPq47xnq-mTQ_teNL2QpSCNpCG5n5H3t', '2024-12-20'],
]
type Item = {
  id: string
  type: 'film' | 'photography'
  imageUrl: string
  videoUrl?: string
  /** ISO date the photograph was taken, from its own EXIF */
  taken?: string
}

/**
 * The `=w` suffix is lh3's own resize, so a grid tile asks for the width it is
 * drawn at rather than the several-megabyte original. Only the lightbox pulls
 * the full file.
 */
function sized(url: string, width: number) {
  return `${url}=w${width}`
}

/** "2026-07-26" as "July 2026". The day is noise at this scale. */
function monthOf(iso: string) {
  const [y, m] = iso.split('-')
  return `${
    ['January','February','March','April','May','June',
     'July','August','September','October','November','December'][Number(m) - 1]
  } ${y}`
}

const GALLERY_ITEMS: Item[] = [
  // The film sits at the top rather than at its date. It is the only one, and
  // the chronology is a claim about the photographs.
  {
    id: 'ninaivu-film',
    type: 'film',
    imageUrl: 'https://lh3.googleusercontent.com/d/1J8QtfX7sUyyT346qgt8P8gFK4OrC6aOe',
    videoUrl: 'https://www.youtube.com/watch?v=1DDs1A89pIw',
  },
  ...PHOTOS.map<Item>(([id, taken], index) => ({
    id: `photo-${index}`,
    type: 'photography',
    imageUrl: `https://lh3.googleusercontent.com/d/${id}`,
    taken,
  })),
]

const FILTERS = ['all', 'photography', 'film'] as const
type Filter = (typeof FILTERS)[number]

function FilterLink({
  value,
  active,
  onSelect,
}: {
  value: Filter
  active: boolean
  onSelect: (v: Filter) => void
}) {
  const stick = useStick()
  return (
    <button
      {...stick}
      onClick={() => onSelect(value)}
      data-active={active}
      aria-pressed={active}
      className="wght-link caption"
    >
      {value}
    </button>
  )
}

function Lightbox({
  item,
  onClose,
  onNext,
  onPrev,
}: {
  item: Item
  onClose: () => void
  onNext: () => void
  onPrev: () => void
}) {
  useScrollLock(true)

  // Swipe: the first thing anyone tries on a phone. Pointer events cover touch
  // and a trackpad drag alike, and 44px is far enough not to fire on a tap.
  const swipeStart = useRef<{ x: number; y: number } | null>(null)

  const onPointerDown = (e: React.PointerEvent) => {
    swipeStart.current = { x: e.clientX, y: e.clientY }
  }

  const onPointerUp = (e: React.PointerEvent) => {
    const start = swipeStart.current
    swipeStart.current = null
    if (!start) return
    const dx = e.clientX - start.x
    // Ignore anything that was mostly vertical: that is a scroll attempt.
    if (Math.abs(dx) < 44 || Math.abs(dx) < Math.abs(e.clientY - start.y)) return
    if (dx < 0) onNext()
    else onPrev()
  }

  if (typeof document === 'undefined') return null

  return createPortal(
    <motion.div
      className="fixed inset-0 z-[120] flex flex-col items-center justify-center bg-background/95 p-4 md:p-12"
      style={{ height: '100dvh' }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Photograph"
    >
      <button
        onClick={e => {
          e.stopPropagation()
          onClose()
        }}
        className="caption fixed right-4 z-10 flex min-h-11 items-center px-3 md:right-10"
        style={{ top: 'calc(env(safe-area-inset-top) + 0.75rem)' }}
      >
        Close [esc]
      </button>

      {/* When it was taken. The gallery is ordered by this, so it is worth
          being able to see it rather than having to infer it from the order. */}
      {item.taken && (
        <span
          className="caption fixed left-4 z-10 flex min-h-11 items-center md:left-10"
          style={{ top: 'calc(env(safe-area-inset-top) + 0.75rem)' }}
        >
          {monthOf(item.taken)}
        </span>
      )}

      {/* Arrows flank the image from sm up. Below that they sat on top of the
          photograph, which on a phone is most of the screen. */}
      <button
        onClick={e => {
          e.stopPropagation()
          onPrev()
        }}
        aria-label="Previous"
        className="absolute left-2 top-1/2 hidden -translate-y-1/2 p-4 text-3xl text-muted-foreground transition-colors hover:text-foreground sm:block md:left-8 md:text-4xl"
      >
        ←
      </button>

      <div
        className="relative flex w-full max-w-7xl flex-1 select-none items-center justify-center"
        onClick={e => e.stopPropagation()}
        onPointerDown={onPointerDown}
        onPointerUp={onPointerUp}
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.img
            key={item.id}
            src={item.imageUrl}
            alt=""
            className="h-auto max-h-full max-w-full rounded-sm object-contain"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.25, ease: [0.25, 0.1, 0.25, 1] }}
            draggable={false}
          />
        </AnimatePresence>
      </div>

      <button
        onClick={e => {
          e.stopPropagation()
          onNext()
        }}
        aria-label="Next"
        className="absolute right-2 top-1/2 hidden -translate-y-1/2 p-4 text-3xl text-muted-foreground transition-colors hover:text-foreground sm:block md:right-8 md:text-4xl"
      >
        →
      </button>

      {/* Phones get the same two controls as a row under the image, where a
          thumb already is. */}
      <div
        className="flex shrink-0 items-center gap-10 pt-3 sm:hidden"
        style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
        onClick={e => e.stopPropagation()}
      >
        <button onClick={onPrev} aria-label="Previous" className="px-6 py-2 text-3xl text-muted-foreground">
          ←
        </button>
        <button onClick={onNext} aria-label="Next" className="px-6 py-2 text-3xl text-muted-foreground">
          →
        </button>
      </div>
    </motion.div>,
    document.body,
  )
}

function GalleryItem({ item, onOpen }: { item: Item; onOpen: () => void }) {
  const highlight = useHighlight()

  return (
    // No `layout`. With 150 tiles it measures every one of them on each filter
    // change, which is the whole cost of the page on a phone; the fade covers
    // the reflow just as well.
    <motion.button
      {...highlight}
      type="button"
      initial={{ opacity: 0, y: 32 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.97 }}
      transition={{ duration: 0.6, ease: [0.215, 0.61, 0.355, 1] }}
      className="group block w-full text-left"
      onClick={onOpen}
    >
      {/* A plate, like everything else: framed field, hairline edge, no lift. */}
      <div className="plate relative flex min-h-[280px] items-center justify-center overflow-hidden p-2 transition-colors duration-500 group-hover:border-foreground/25">
        <img
          src={sized(item.imageUrl, 800)}
          srcSet={`${sized(item.imageUrl, 600)} 600w, ${sized(item.imageUrl, 1200)} 1200w`}
          sizes="(max-width: 768px) 100vw, 40vw"
          alt=""
          loading="lazy"
          decoding="async"
          className="block h-auto w-full rounded-md object-contain"
        />

        {item.videoUrl && (
          <span className="caption absolute bottom-4 left-4 rounded-sm bg-background/80 px-2 py-1">
            Film
          </span>
        )}
      </div>
    </motion.button>
  )
}

export default function PhotographyPage() {
  const [filter, setFilter] = useState<Filter>('all')
  const [selected, setSelected] = useState<Item | null>(null)

  const filtered =
    filter === 'all' ? GALLERY_ITEMS : GALLERY_ITEMS.filter(item => item.type === filter)

  const lightboxItems = filtered.filter(item => !item.videoUrl)
  const currentIndex = lightboxItems.findIndex(item => item.id === selected?.id)

  const handleNext = useCallback(() => {
    if (currentIndex === -1) return
    setSelected(lightboxItems[(currentIndex + 1) % lightboxItems.length])
  }, [currentIndex, lightboxItems])

  const handlePrev = useCallback(() => {
    if (currentIndex === -1) return
    setSelected(lightboxItems[(currentIndex - 1 + lightboxItems.length) % lightboxItems.length])
  }, [currentIndex, lightboxItems])

  useEffect(() => {
    if (!selected) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSelected(null)
      else if (e.key === 'ArrowRight') handleNext()
      else if (e.key === 'ArrowLeft') handlePrev()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [selected, handleNext, handlePrev])

  return (
    <main className="min-h-[100svh]">
      {/* a halftone screen seen through a lens, which is how the pictures got here */}
      <Backdrop pattern="halftone" />

      <div className="mx-auto w-full max-w-6xl px-6 pb-32 pt-36 md:px-8 md:pt-44">
        <PageHeader
          title="Photography and film"
          lede="Mostly documentary photographs, plus the film work I have been part of. I tend to shoot things that were going to happen anyway."
        />

        <div className="mt-16 flex items-center gap-6 border-t border-border pt-8">
          {FILTERS.map(value => (
            <FilterLink
              key={value}
              value={value}
              active={filter === value}
              onSelect={setFilter}
            />
          ))}
        </div>

        <motion.div className="mt-12 grid grid-cols-1 gap-x-10 gap-y-14 md:grid-cols-2">
          <AnimatePresence mode="popLayout">
            {filtered.map(item => (
              <GalleryItem
                key={item.id}
                item={item}
                onOpen={() => {
                  if (item.videoUrl) window.open(item.videoUrl, '_blank', 'noopener,noreferrer')
                  else setSelected(item)
                }}
              />
            ))}
          </AnimatePresence>
        </motion.div>
      </div>

      <AnimatePresence>
        {selected && !selected.videoUrl && (
          <Lightbox
            item={selected}
            onClose={() => setSelected(null)}
            onNext={handleNext}
            onPrev={handlePrev}
          />
        )}
      </AnimatePresence>
    </main>
  )
}
