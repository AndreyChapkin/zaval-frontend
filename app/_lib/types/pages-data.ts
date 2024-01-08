import type { DetailedTodoDto, TodoLightDto, TodoStatus } from './todo';

export interface TodoDetailedPageData {
	detailedTodoDto: DetailedTodoDto;
	todoHistoryRecords: string[];
}

export interface TodoRootPageData {
	rootLightTodos: TodoLightDto[];
	recentLightTodos: TodoLightDto[];
	oldLightTodos: TodoLightDto[];
}

export interface TodoAndParentBranchIdDto {
    todo: TodoLightDto;
    parentBranchId: number | null;
}

export interface TodosListDto {
    todos: TodoAndParentBranchIdDto[];
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
