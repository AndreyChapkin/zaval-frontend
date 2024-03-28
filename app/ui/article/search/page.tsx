'use client';

import { ArticleCard } from "@/app/_components/article/article-card/ArticleCard";
import LoadingIndicator from "@/app/_components/general/loading-indicator/LoadingIndicator";
import { StandardInput } from "@/app/_components/general/standard-input/StandardInput";
import { findAllArticlesWithTitleFragment, getTheMostRecentArticleLights } from "@/app/_lib/calls/article-calls";
import { decreaseNumberOfCalls } from "@/app/_lib/utils/function-helpers";
import { useEffect, useMemo, useState } from "react";

import './page.scss';

const ArticleSearchPage = () => {

    // const [searchValue, setSearchValue] = useState('');
    // const [foundArticles, setFoundArticles] = useState<ArticleLightDto[]>([]);
    // const [recentArticles, setRecentArticles] = useState<ArticleLightDto[]>([]);
    // const [isLoading, setIsLoading] = useState(false);

    // useEffect(() => {
    //     getTheMostRecentArticleLights(10).then((data) => {
    //         setRecentArticles(data);
    //     });
    // }, []);

    // const searchArticles = useMemo(() => decreaseNumberOfCalls((value: string) => {
    //     setIsLoading(true);
    //     findAllArticlesWithTitleFragment(value).then((data) => {
    //         setIsLoading(false);
    //         setFoundArticles(data);
    //     });
    // }, 500), []);

    // useEffect(() => {
    //     if (searchValue) {
    //         searchArticles(searchValue);
    //     }
    // }, [searchValue]);

    // return (
    //     <div className="articleSearchPage page row gap2">
    //         <div className="searchPanel flex2 column gap2">
    //             <StandardInput
    //                 value={searchValue}
    //                 onChange={setSearchValue} />
    //             <div className="foundArticles scrollableInColumn column gap3">
    //                 {
    //                     isLoading ?
    //                         <LoadingIndicator /> :
    //                         foundArticles.length > 0 ?
    //                             foundArticles.map(article => (
    //                                 <ArticleCard key={article.id} articleLight={article} />
    //                             ))
    //                             : "No articles found"
    //                 }
    //             </div>
    //         </div>
    //         <div className="recent flex1 column gap2">
    //             <div>Recent</div>
    //             <div className="recentArticles scrollableInColumn flex1 column gap3">
    //                 {
    //                     recentArticles.map(article => (
    //                         <ArticleCard key={article.id} articleLight={article} />
    //                     ))
    //                 }
    //             </div>
    //         </div>
    //     </div>
    // );
};

export default ArticleSearchPage;