import { ARTICLE_ICON_URL, ROOT_MENU_ICON_URL, SEARCH_ICON_URL } from "@/app/_lib/constants/image-url-constants";
import { chooseStatusImgUrl, todoStatusToUrlForm } from "@/app/_lib/utils/todo-helpers";
import './SideMenu.scss';
import { IconButton } from "../icon-button/IconButton";

function SideMenu() {
    return (
        <div className="todoSideMenu">
            <div className="todoSideMenuItem">
                <a href={`/todo/${todoStatusToUrlForm('IN_PROGRESS')}`}>
                    <IconButton
                        iconUrl={chooseStatusImgUrl('IN_PROGRESS')} />
                </a>
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
    );
}

export default SideMenu;