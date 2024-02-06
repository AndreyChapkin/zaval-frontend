interface ArticleLightDto {
    id: number;
    title: string;
    interactedOn: string;
}

interface ArticleContentDto {
    id: number;
    content: string;
}

interface UpdateArticleDto {
    title?: string;
    popularity?: number;
    content?: string;
}