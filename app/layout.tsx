// "use client";

import { useEffect } from "react";
import type { Metadata } from "next";
import "./globals.css";
import localFont from "next/font/local";
import RecoilWrapper from "@/recoil/recoil-wrapper";
import Header from "@/components/global/header";
import Footer from "@/components/global/footer";
import Toast from "@/components/global/toast";
import { usePathname } from "next/navigation";
import AuthProvider from "@/components/(auth)/AuthProvider";

// const suit = localFont({
//   src: "./fonts/SUIT-Variable.woff2",
// });

// type Props = {
//   children: React.ReactNode;
// };

// export default function RootLayout({ children }: Props) {
//   const pathname = usePathname();

//   if (pathname.startsWith("/chats")) {
//     return (
//       <html lang="en">
//         <body className={suit.className}>
//           <AuthProvider>
//             <RecoilWrapper>
//               <Header />
//               {children}
//             </RecoilWrapper>
//           </AuthProvider>
//         </body>
//       </html>
//     );
//   }

//   return (
//     <html lang="en">
//       <body className={suit.className}>
//         <AuthProvider>
//           <RecoilWrapper>
//             <Header />
//             {children}
//             <Toast />
//             <Footer />
//           </RecoilWrapper>
//         </AuthProvider>
//       </body>
//     </html>
//   );
// }
