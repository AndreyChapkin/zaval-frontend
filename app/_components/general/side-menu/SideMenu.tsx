"use client";

import { ARTICLE_ICON_URL, CREATE_ICON_URL, SEARCH_ICON_URL } from "@/app/_lib/constants/image-url-constants";
import { chooseStatusImgUrl, todoStatusToUrlForm } from "@/app/_lib/utils/todo-helpers";
import { use, useEffect, useState } from "react";
import CreateTodo from "../../todo/create-todo-modal/CreateTodoModal";
import { SearchTodoModal } from "../../todo/search-todo-modal/SearchTodoModal";
import { IconButton } from "../icon-button/IconButton";
import './SideMenu.scss';
import { usePathname } from "next/navigation";

function SideMenu() {

    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const pathname = usePathname();

    useEffect(() => {
        setIsCreateOpen(false);
        setIsSearchOpen(false);
    }, [pathname]);

    return (
        <>
            <div className="todoSideMenu columnStartAndCenter">
                <div className="todoSideMenuItem">
                    <a href={`/ui/todo/status?status=${todoStatusToUrlForm('IN_PROGRESS')}`}>
                        <IconButton
                            iconUrl={chooseStatusImgUrl('IN_PROGRESS')} />
                    </a>
                </div>
                <div className="todoSideMenuItem">
                    <IconButton
                        onClick={() => { setIsCreateOpen(true) }}
                        iconUrl={CREATE_ICON_URL} />
                </div>
                <div className="todoSideMenuItem">
                    <IconButton
                        onClick={() => { setIsSearchOpen(true) }}
                        iconUrl={SEARCH_ICON_URL} />
                </div>
                <div className="separator" />
                <div className="todoSideMenuItem">
                    <a href="/article">
                        <IconButton
                            iconUrl={ARTICLE_ICON_URL} />
                    </a>
                </div>
            </div>
            {
                isCreateOpen &&
                <CreateTodo onCancel={() => { setIsCreateOpen(false) }} onSuccess={() => { setIsCreateOpen(false) }} />
            }
            {
                isSearchOpen &&
                <SearchTodoModal onClose={() => { setIsSearchOpen(false) }} />
            }
        </>
    );
}

export default SideMenu;