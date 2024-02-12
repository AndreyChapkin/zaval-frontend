import React from 'react';
import { IconButton } from '../../general/icon-button/IconButton';
import { SEE_ICON_URL } from '@/app/_lib/constants/image-url-constants';

import './ArticleCard.scss';
import { presentDate } from '@/app/_lib/utils/presentation-helpers';
import Link from 'next/link';

interface ArticleCardProps {
    articleLight: ArticleLightDto;
}

export const ArticleCard: React.FC<ArticleCardProps> = ({ articleLight }) => {
    return (
        <div className="articleCard rowStartAndStretch gap1">
            <Link className="column" href={`/ui/article/${articleLight.id}`}>
                <div className="navigation flex1 columnCenterAndCenter">
                    <img src={SEE_ICON_URL} />
                </div>
            </Link>
            <div className='mainPanel columnJustify gap'>
                <div className='articleTitle'>
                    {articleLight.title}
                </div>
                <div className='interactedOn'>
                    {presentDate(articleLight.interactedOn)}
                </div>
            </div>
        </div >
    );
};
