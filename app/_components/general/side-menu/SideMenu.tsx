import { ARTICLE_ICON_URL, ROOT_MENU_ICON_URL, SEARCH_ICON_URL } from "@/app/_lib/constants/image-url-constants";
import { chooseStatusImgUrl, todoStatusToUrlForm } from "@/app/_lib/utils/todo-helpers";
import './SideMenu.scss';

function SideMenu() {
    return (
        <div className="todoSideMenu">
            <div className="todoSideMenuItem">
                <a href={`/todo/${todoStatusToUrlForm('IN_PROGRESS')}`}>
                    <img
                        src={chooseStatusImgUrl('IN_PROGRESS')}
                        alt="status"
                    />
                </a>
            </div>
            <div className="todoSideMenuItem">
                <a href={`/todo/root`}>
                    <img
                        src={ROOT_MENU_ICON_URL}
                        alt="status"
                    />
                </a>
            </div>
            <div className="todoSideMenuItem">
                <img
                    src={SEARCH_ICON_URL}
                    alt="search"
                />
            </div>
            <div className="separator" />
            <div className="todoSideMenuItem">
                <a href="/article">
                    <img
                        src={ARTICLE_ICON_URL}
                        alt="search"
                    />
                </a>
            </div>
        </div>
    );
}

export default SideMenu;