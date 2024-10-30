import Image from "next/image";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";
import { FaBars } from "react-icons/fa";

import { DrawerItemButton, DrawerItemButtonLoader } from "./DrawerItemButton";
import type { DisplayProps } from "./Sidebar";
import Sidebar from "./Sidebar";
import { useAuth } from "../../hooks/useAuth";
import { api } from "../../utils/api";
import AuthItem from "../sidebar/AuthItem";
import LinkIconItem from "../sidebar/LinkIconItem";
import LinkItem from "../sidebar/LinkItem";
import { PAGE_LINKS, SOCIAL_LINKS } from "../sidebar/links";

const LeftSidebar = ({ show, setShow, onReload }: DisplayProps & { onReload?: () => void }) => {
  const router = useRouter();
  const { session, signIn, signOut, status } = useAuth();
  const [t] = useTranslation("drawer");

  const { isLoading, data } = api.agent.getAll.useQuery(undefined, {
    enabled: status === "authenticated",
  });
  const userAgents = data ?? [];

  const navigateToPage = (href: string) => {
    if (router.pathname === href) {
      onReload?.();
      return;
    }

    void router.push(href);
  };

  return (
    <Sidebar show={show} setShow={setShow} side="left" className="border-slate-6s border-r">
      <div className="flex flex-row items-center pb-6">
        <button
          className="ml-auto rounded-md border-none transition-all hover:bg-slate-5"
          onClick={() => setShow(!show)}
        >
          <FaBars size="12" className="z-20 m-2 text-slate-11" />
        </button>
      </div>
      <button
        className="mb-4 rounded-md bg-slate-1 p-1 shadow-depth-1 hover:bg-slate-2"
        onClick={() => navigateToPage("/")}
      >
        New Agent
      </button>
   
    </Sidebar>
  );
};

export default LeftSidebar;
