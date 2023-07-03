import { hashtagRegex, mentionRegex, urlRegex } from '@lib/markupUtils';
import trimify from 'lib/trimify';
import type { FC } from 'react';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import remarkBreaks from 'remark-breaks';
// @ts-ignore
import linkifyRegex from 'remark-linkify-regex';
import stripMarkdown from 'strip-markdown';

import Code from './Code';
import MarkupLink from './MarkupLink';
import { PluggableList } from 'react-markdown/lib/react-markdown';

const plugins = [
  [stripMarkdown, { keep: ['strong', 'emphasis', 'inlineCode', 'html'] }],
  remarkBreaks,
  linkifyRegex(mentionRegex),
  linkifyRegex(hashtagRegex),
  linkifyRegex(urlRegex)
];

const components = {
  a: MarkupLink,
  code: Code
};

interface MarkupProps {
  children: string;
  className?: string;
  matchOnlyUrl?: boolean;
}

const Markup: FC<MarkupProps> = ({ children, className = '' }) => {
  return (
    <ReactMarkdown
      className={className}
      components={components}
      rehypePlugins={rehypeRaw as any}
      remarkPlugins={plugins}
    >
      {trimify(children)}
    </ReactMarkdown>
  );
};

export default Markup;
