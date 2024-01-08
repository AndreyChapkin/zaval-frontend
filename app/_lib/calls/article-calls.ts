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

export async function findAllArticlesWithAllLabels(labelIds: number[]): Promise<ArticleLightDto[]> {
    const url = `${baseArticleURL}/with-labels`;
    const result = await callPost<ArticleLightDto[]>(url, {
        labelIds,
    });
    return result.data;
}

export async function findAllArticlesWithLabelNameFragment(nameFragment: string): Promise<ArticleLightWithLabelsDto[]> {
    const url = `${baseArticleURL}/with-label-name-fragment`;
    const result = await callGet<ArticleLightWithLabelsDto[]>(url, {
        "name-fragment": nameFragment,
    });
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

export async function getArticleLabels(id: number): Promise<ArticleLabelDto[]> {
    const url = `${baseArticleURL}/${id}/connected-labels`;
    const result = await callGet<ArticleLabelDto[]>(url);
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

export async function createArticleLabel(articleLabelDto: ArticleLabelDto): Promise<ArticleLabelDto> {
    const url = `${baseArticleURL}/label`;
    const result = await callPost<ArticleLabelDto>(url, articleLabelDto);
    return result.data;
}

export async function getAllArticleLabels(): Promise<ArticleLabelDto[]> {
    const url = `${baseArticleURL}/label`;
    const result = await callGet<ArticleLabelDto[]>(url);
    return result.data;
}

export async function findAllArticleLabelsWithNameFragment(nameFragment: string): Promise<ArticleLabelDto[]> {
    const url = `${baseArticleURL}/label/with-name-fragment`;
    const result = await callGet<ArticleLabelDto[]>(url, {
        "name-fragment": nameFragment,
    });
    return result.data;
}

export async function getArticleLabel(id: number): Promise<ArticleLabelDto> {
    const url = `${baseArticleURL}/label/${id}`;
    const result = await callGet<ArticleLabelDto>(url);
    return result.data;
}

export async function updateArticleLabel(articleLabelId: number, updateArticleLabelDto: UpdateArticleLabelDto): Promise<void> {
    const url = `${baseArticleURL}/label/${articleLabelId}`;
    await callPatch<UpdateArticleDto>(url, updateArticleLabelDto);
}

export async function deleteArticleLabel(articleLabelId: number): Promise<void> {
    const url = `${baseArticleURL}/label/${articleLabelId}`;
    await callDelete<void>(url);
}

export async function bindLabelsToArticle(labelIds: number[], articleId: number): Promise<void> {
    const url = `${baseArticleURL}/label/bind`;
    const result = await callPost<void>(url, {
        labelIds,
        articleId,
    });
    return result.data;
}

export async function unbindLabelsFromArticle(labelIds: number[], articleId: number): Promise<void> {
    const url = `${baseArticleURL}/label/unbind`;
    const result = await callPost<void>(url, {
        labelIds,
        articleId,
    });
    return result.data;
}

export async function createLabelsCombination(labelIds: number[]): Promise<LabelsCombinationDto> {
    const url = `${baseArticleURL}/label/combination`;
    const result = await callPost<LabelsCombinationDto>(url, {
        labelIds
    });
    return result.data;
}

export async function getTheMostPopularLabelsCombinations(number?: number): Promise<FilledLabelsCombinationDto[]> {
    const url = `${baseArticleURL}/label/combination/popular`;
    const result = await callGet<FilledLabelsCombinationDto[]>(url, { number });
    return result.data;
}

export async function updateLabelsCombinationPopularity(labelsCombinationId: number, popularity: number): Promise<void> {
    const url = `${baseArticleURL}/label/combination/${labelsCombinationId}`;
    await callPatch<UpdateArticleDto>(url, { popularity });
}

export async function deleteLabelsCombination(combinationId: number): Promise<void> {
    const url = `${baseArticleURL}/label/combination/${combinationId}`;
    await callDelete<void>(url);
}

export async function createArticleSeries(articleSeriesDto: ArticleSeriesDto): Promise<ArticleSeriesDto> {
    const url = `${baseArticleURL}/series`;
    const result = await callPost<ArticleSeriesDto>(url, articleSeriesDto);
    return result.data;
}

export async function getArticleSeries(articleSeriesId: number): Promise<ArticleSeriesDto> {
    const url = `${baseArticleURL}/series/${articleSeriesId}`;
    const result = await callGet<ArticleSeriesDto>(url);
    return result.data;
}

export async function getArticleSeriesContent(articleSeriesId: number): Promise<(ArticleLightDto | ArticleSeriesDto)[]> {
    const url = `${baseArticleURL}/series/${articleSeriesId}/content`;
    const result = await callGet<(ArticleLightDto | ArticleSeriesDto)[]>(url);
    return result.data;
}

export async function findAllArticleSeriesWithAllLabels(labelIds: number[]): Promise<ArticleSeriesDto[]> {
    const url = `${baseArticleURL}/series/with-labels`;
    const result = await callPost<ArticleSeriesDto[]>(url, {
        labelIds,
    });
    return result.data;
}

export async function findAllArticleSeriesWithFragment(fragment: string): Promise<ArticleSeriesDto[]> {
    const url = `${baseArticleURL}/series/with-fragment`;
    const result = await callGet<ArticleSeriesDto[]>(url, {
        "fragment": fragment,
    });
    return result.data;
}

export async function getTheMostRecentArticleSeries(number?: number): Promise<ArticleSeriesDto[]> {
    const url = `${baseArticleURL}/series/recent`;
    const result = await callGet<ArticleSeriesDto[]>(url, { number });
    return result.data;
}

export async function updateArticleSeries(articleSeriesId: number, updateArticleSeriesDto: UpdateArticleSeriesDto): Promise<void> {
    const url = `${baseArticleURL}/series/${articleSeriesId}`;
    await callPatch<UpdateArticleDto>(url, updateArticleSeriesDto);
}

export async function deleteArticleSeries(articleSeriesId: number): Promise<void> {
    const url = `${baseArticleURL}/series/${articleSeriesId}`;
    await callDelete<void>(url);
}