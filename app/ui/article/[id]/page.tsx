'use client';

import { EditArticlePanel } from '@/app/_components/article/edit-article-panel/EditArticlePanel';
import { IconButton } from '@/app/_components/general/icon-button/IconButton';
import LoadingIndicator from '@/app/_components/general/loading-indicator/LoadingIndicator';
import { RemoveModal } from '@/app/_components/general/remove-modal/RemoveModal';
import { RichText } from '@/app/_components/general/rich-text/RichText';
import { deleteArticle, getArticleContent, getArticleLight } from '@/app/_lib/calls/article-calls';
import { EDIT_ICON_URL, REMOVE_ICON_URL } from '@/app/_lib/constants/image-url-constants';
import { useParams } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';

import './page.scss';
import { RichElement, RichTitleElement, TITLES_ARRAY } from '@/app/_lib/types/rich-text-types';

type ArticlePageData = {
    state: 'loading'
} | {
    state: 'ready',
    articleLightDto: ArticleLightDto,
    articleContent: ArticleContentDto,
} | {
    state: 'notFound'
};

const ArticlePage = () => {

    const [data, setData] = useState<ArticlePageData>({ state: 'loading' });
    const params = useParams<{ id: string }>();
    const id = Number(params.id);
    const [isEditing, setIsEditing] = useState(false);
    const [isRemoveOpen, setIsRemoveOpen] = useState(false);

    const richElements: RichElement[] = useMemo(() => {
        if (data.state === 'ready') {
            return data.articleContent.content.length > 0 ? JSON.parse(data.articleContent.content) : [];
        }
        return [];
    }, [data]);

    const titleElements: RichTitleElement[] = useMemo(() => {
        return richElements.filter((element) => TITLES_ARRAY.indexOf(element.type as any) > -1) as RichTitleElement[];
    }, [richElements]);

    const removeHandler = () => {
        deleteArticle(id).then(() => window.location.href = '/ui/article/search');
    };

    useEffect(() => {
        Promise.all([getArticleLight(id), getArticleContent(id)])
            .then(([articleLight, articleContent]) => {
                if (articleLight === null || articleContent === null) {
                    setData({ state: 'notFound' });
                    return;
                }
                setData({
                    state: 'ready',
                    articleLightDto: articleLight,
                    articleContent
                });
            });
    }, []);

    return (
        <div className="page articlePage rowStartAndStretch gap2">
            {
                data.state === 'loading' ?
                    <LoadingIndicator />
                    :
                    data.state === 'notFound' ?
                        "No such article"
                        :
                        <>
                            <div className='article flex3 column gap2'>
                                {
                                    isEditing ?
                                        <EditArticlePanel
                                            articleLight={data.articleLightDto}
                                            description={data.articleContent.content}
                                            onCancel={() => setIsEditing(false)}
                                            onSuccess={() => window.location.reload()} />
                                        :
                                        <>
                                            <div className='controlPanel rowStartAndCenter gap3'>
                                                <IconButton iconUrl={EDIT_ICON_URL} onClick={() => setIsEditing(true)} />
                                                <IconButton iconUrl={REMOVE_ICON_URL} onClick={() => setIsRemoveOpen(true)} />
                                            </div>
                                            <div className='mainPanel column gap3 flex3'>
                                                <div className='articleTitle'>{data.articleLightDto.title}</div>
                                                <RichText richContent={richElements} />
                                            </div>
                                        </>
                                }
                            </div>
                            {
                                !isEditing &&
                                <div className='tableOfContents flex1 column scrollableInRowVertically gap2'>
                                    {
                                        titleElements.map((titleElement) => {
                                            let titleRecordClass = "firstLevel";
                                            switch (titleElement.type) {
                                                case 'title-1':
                                                    titleRecordClass = "firstLevel";
                                                    break;
                                                case 'title-2':
                                                    titleRecordClass = "secondLevel";
                                                    break;
                                                case 'title-3':
                                                    titleRecordClass = "thirdLevel";
                                                    break;
                                                case 'title-4':
                                                    titleRecordClass = "fourthLevel";
                                                    break;
                                            }
                                            return (
                                                <div key={titleElement.id} className={titleRecordClass}>
                                                    <a href={`#${titleElement.id}`}>- {titleElement.text}</a>
                                                </div>
                                            )
                                        })
                                    }
                                </div>
                            }
                        </>
            }
            {
                isRemoveOpen &&
                <RemoveModal
                    onAccept={removeHandler}
                    onCancel={() => setIsRemoveOpen(false)} />
            }
        </div>
    );
};

export default ArticlePage;