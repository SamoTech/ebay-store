import { NextResponse } from 'next/server';
import { blogArticles } from '../../lib/blog-data';
import { SITE_URL } from '../../lib/site';

export const revalidate = 3600;

function escapeXml(value: string): string {
  return value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&apos;');
}

export async function GET() {
  const items = blogArticles.map((article) => {
    const url = SITE_URL + '/blog/' + article.slug;
    const pubDate = new Date(article.date).toUTCString();
    const safeContent = article.excerpt.replace(/]]>/g, ']]]]><![CDATA[>');
    return [
      '    <item>',
      '      <title>' + escapeXml(article.title) + '</title>',
      '      <link>' + url + '</link>',
      '      <guid isPermaLink="true">' + url + '</guid>',
      '      <pubDate>' + pubDate + '</pubDate>',
      '      <category>' + escapeXml(article.category) + '</category>',
      '      <description>' + escapeXml(article.excerpt) + '</description>',
      '      <content:encoded><![CDATA[<p>' + safeContent + '</p>]]></content:encoded>',
      '    </item>',
    ].join('\n');
  }).join('\n');

  const latestDate = blogArticles.length
    ? new Date(Math.max(...blogArticles.map((article) => new Date(article.date).getTime()))).toUTCString()
    : new Date().toUTCString();

  const rss = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:content="http://purl.org/rss/1.0/modules/content/">',
    '  <channel>',
    '    <title>DealsHub Blog - Best Deals &amp; Shopping Guides</title>',
    '    <link>' + SITE_URL + '/blog</link>',
    '    <description>Discover the best deals on eBay with our shopping guides, product reviews, and affiliate marketing tips.</description>',
    '    <language>en-US</language>',
    '    <lastBuildDate>' + latestDate + '</lastBuildDate>',
    '    <atom:link href="' + SITE_URL + '/rss.xml" rel="self" type="application/rss+xml"/>',
    '    <image>',
    '      <url>' + SITE_URL + '/logo.png</url>',
    '      <title>DealsHub Blog</title>',
    '      <link>' + SITE_URL + '/blog</link>',
    '    </image>',
    items,
    '  </channel>',
    '</rss>',
  ].join('\n');

  return new NextResponse(rss, {
    status: 200,
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400',
    },
  });
}