import { getArticleLight } from '@/app/_lib/calls/article-calls';
import React, { useState } from 'react';

const ArticlePage = () => {

    const [articleLightDto, setArticleLightDto] = useState<ArticleLightDto | null>(null);
    const [articleContent, setArticleContent] = useState<ArticleContentDto | null>(null);

    useEffect(() => {
        getArticleLight().then(setArticleLightDto);
        getArticleContentDto().then(setArticleContent);
    }, []);

    return (
        <div className="page articlePage row gap3">
            
        </div>
    );
};

export default MyPage;