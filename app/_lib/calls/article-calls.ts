import { callDelete, callGet, callPatch, callPost } from "./base-calls";
import { baseURL } from "../constants/url-constants";

const baseArticleURL = baseURL + "/article";

export async function createArticle(title: string): Promise<ArticleLightDto> {
    const url = baseArticleURL;
    const result = await callPost<ArticleLightDto>(url, { title });
    return result.data;
}

export async function getAllArticleLights(): Promise<ArticleLightDto[]> {
    const url = `${baseArticleURL}`;
    const result = await callGet<ArticleLightDto[]>(url);
    return result.data;
}

export async function getArticleLightsById(articleIds: number[]): Promise<ArticleLightDto[]> {
    const url = `${baseArticleURL}/by-id`;
    const result = await callPost<ArticleLightDto[]>(url, { articleIds });
    return result.data;
}

export async function getArticleLight(id: number): Promise<ArticleLightDto> {
    const url = `${baseArticleURL}/${id}`;
    const result = await callGet<ArticleLightDto>(url);
    return result.data;
}

export async function findAllArticlesWithTitleFragment(titleFragment: string): Promise<ArticleLightDto[]> {
    const url = `${baseArticleURL}/with-title-fragment`;
    const result = await callGet<ArticleLightDto[]>(url, {
        "title-fragment": titleFragment,
    });
    return result.data;
}

export async function getTheMostRecentArticleLights(number?: number): Promise<ArticleLightDto[]> {
    const url = `${baseArticleURL}/recent`;
    const result = await callGet<ArticleLightDto[]>(url, {
        number,
    });
    return result.data;
}

export async function getArticleContent(id: number): Promise<ArticleContentDto> {
    const url = `${baseArticleURL}/${id}/content`;
    const result = await callGet<ArticleContentDto>(url);
    return result.data;
}

export async function updateArticle(articleId: number, updateArticleDto: UpdateArticleDto): Promise<void> {
    const url = `${baseArticleURL}/${articleId}`;
    await callPatch<UpdateArticleDto>(url, updateArticleDto);
}

export async function deleteArticle(articleId: number): Promise<void> {
    const url = `${baseArticleURL}/${articleId}`;
    await callDelete<void>(url);
}