"use client";

import { ADD_ARTICLE_ICON_URL, ARTICLE_ICON_URL, CREATE_ICON_URL, RECENT_ICON_URL, SEARCH_ICON_URL } from "@/app/_lib/constants/image-url-constants";
import { chooseStatusImgUrl, todoStatusToUrlForm } from "@/app/_lib/utils/todo-helpers";
import { use, useEffect, useState } from "react";
import CreateTodo from "../../todo/create-todo-modal/CreateTodoModal";
import { SearchTodoModal } from "../../todo/search-todo-modal/SearchTodoModal";
import { IconButton } from "../icon-button/IconButton";
import './SideMenu.scss';
import { usePathname } from "next/navigation";
import CreateArticleModal from "../../article/create-article-modal/CreateArticleModal";
import { ModalWindow } from "../modal-window/ModalWindow";
import RecentTodosCard from "../../todo/recent-todos-card/RecentTodosCard";
import FCol from "../flex-line/FCol";

function SideMenu() {

    const [isCreateTodoOpen, setIsCreateTodoOpen] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [isCreateArticleOpen, setIsCreateArticleOpen] = useState(false);
    const [isRecentOpen, setIsRecentOpen] = useState(false);
    const pathname = usePathname();

    useEffect(() => {
        setIsCreateTodoOpen(false);
        setIsSearchOpen(false);
        setIsCreateArticleOpen(false);
        setIsRecentOpen(false);
    }, [pathname]);

    const createArticleHandler = (article: ArticleLightDto) => {
        window.location.href = `/ui/article/${article.id}`;
    };

    return (
        <>
            <FCol className="todoSideMenu" justifyContent="start" alignItems="center">
                <div className="todoSideMenuItem">
                    <a href={`/ui/todo/status?status=${todoStatusToUrlForm('IN_PROGRESS')}`}>
                        <IconButton
                            iconUrl={chooseStatusImgUrl('IN_PROGRESS')} />
                    </a>
                </div>
                <div className="todoSideMenuItem">
                    <IconButton
                        onClick={() => { setIsCreateTodoOpen(true) }}
                        iconUrl={CREATE_ICON_URL} />
                </div>
                <div className="todoSideMenuItem">
                    <IconButton
                        onClick={() => { setIsSearchOpen(true) }}
                        iconUrl={SEARCH_ICON_URL} />
                </div>
                <div className="todoSideMenuItem">
                    <IconButton
                        onClick={() => { setIsRecentOpen(true) }}
                        iconUrl={RECENT_ICON_URL} />
                </div>
                <div className="separator" />
                <div className="todoSideMenuItem">
                    <a href="/ui/article/search">
                        <IconButton
                            iconUrl={ARTICLE_ICON_URL} />
                    </a>
                </div>
                <div className="todoSideMenuItem">
                    <IconButton
                        iconUrl={ADD_ARTICLE_ICON_URL}
                        onClick={() => setIsCreateArticleOpen(true)} />
                </div>
            </FCol>
            {
                isCreateTodoOpen &&
                <CreateTodo onCancel={() => { setIsCreateTodoOpen(false) }} onSuccess={() => { setIsCreateTodoOpen(false) }} />
            }
            {
                isSearchOpen &&
                <SearchTodoModal onClose={() => { setIsSearchOpen(false) }} />
            }
            {
                isCreateArticleOpen &&
                <CreateArticleModal onCancel={() => { setIsCreateArticleOpen(false) }} onSuccess={createArticleHandler} />
            }
            {
                isRecentOpen &&
                <ModalWindow
                    direction="column"
                    alignItems="stretch"
                    width={80}
                    height={80}
                    onClose={() => setIsRecentOpen(false)}
                >
                    <RecentTodosCard className="p-2" />
                </ModalWindow>
            }
        </>
    );
}

export default SideMenu;