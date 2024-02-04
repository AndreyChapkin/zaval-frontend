"use client";

import { ARTICLE_ICON_URL, CREATE_ICON_URL, ROOT_MENU_ICON_URL, SEARCH_ICON_URL } from "@/app/_lib/constants/image-url-constants";
import { chooseStatusImgUrl, todoStatusToUrlForm } from "@/app/_lib/utils/todo-helpers";
import './SideMenu.scss';
import { IconButton } from "../icon-button/IconButton";
import CreateTodo from "../../todo/create-todo-modal/CreateTodoModal";
import { useState } from "react";

function SideMenu() {

    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            <div className="todoSideMenu columnCenter">
                <div className="todoSideMenuItem">
                    <a href={`/ui/todo/status?status=${todoStatusToUrlForm('IN_PROGRESS')}`}>
                        <IconButton
                            iconUrl={chooseStatusImgUrl('IN_PROGRESS')} />
                    </a>
                </div>
                <div className="todoSideMenuItem">
                    <IconButton
                        onClick={() => { setIsOpen(true) }}
                        iconUrl={CREATE_ICON_URL} />
                </div>
                <div className="todoSideMenuItem">
                    <a href={`/todo/root`}>
                        <IconButton
                            iconUrl={ROOT_MENU_ICON_URL} />
                    </a>
                </div>
                <div className="todoSideMenuItem">
                    <IconButton
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
                isOpen &&
                <CreateTodo cancelHandler={() => { setIsOpen(false) }} successHandler={() => { setIsOpen(false) }} />
            }
        </>
    );
}

export default SideMenu;