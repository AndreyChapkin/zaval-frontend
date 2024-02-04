import type { TodoLightDto, TodoStatus } from './todo-types';

export interface TodoRootPageData {
	rootLightTodos: TodoLightDto[];
	recentLightTodos: TodoLightDto[];
	oldLightTodos: TodoLightDto[];
}

export interface TodoLeafWithBranchIdDto {
    leafTodo: TodoLightDto;
    parentBranchId: number | null;
}

export interface TodosListDto {
    leafTodos: TodoLeafWithBranchIdDto[];
    parentBranchesMap: Record<number, TodoLightDto[]>;
}

export interface TodosWithStatusPageData {
	todosList: TodosListDto;
	status: TodoStatus;
}

export interface MultipleArticlesPageData {
	articleLights: ArticleLightDto[];
	articleSeries: ArticleSeriesDto[];
	topLabelsCombinations: FilledLabelsCombinationDto[];
}

export interface ArticlePageData {
	articleLight: ArticleLightDto;
	articleContent: ArticleContentDto;
	articleLabels: ArticleLabelDto[];
}

export interface ArticleSeriesPageData {
	articleSeries: ArticleSeriesDto;
	articleSeriesContent: (ArticleLightDto | ArticleSeriesDto)[];
}