import { getAllMarkdownFiles } from "./io";
import fs from "fs";
import { Transformer } from "./transformer";
import { isJapanese, toKana, tokenize, toRomaji } from "wanakana";
import { getRouterPath } from "./slug";

export interface SearchData {
	title: string;
	rawTitle: string | null;
	singleLineContent: string;
	rawContent: RawContent | null;
	lineAt: number;
	path: string;
}

export interface RawContent {
	raw: string;
	separatedOriginal: string[];
	separatedRaw: string[];
}

export function getSearchIndex(): SearchData[] {
		const result: SearchData[] = [];
		const filePaths = getAllMarkdownFiles();
		filePaths.forEach((markdownFile) => {
			const title = Transformer.parseFileNameFromPath(markdownFile);
			if (title == null || title.match(/\.[a-zA-Z0-9]*$/)) {
				return;
			}
			const rawTitle = isJapanese(title) ? toRomaji(title) : title;
			const content = fs.readFileSync(markdownFile);
			if (content === null || content === undefined) {
				return;
			}
			const path = getRouterPath(`${title}.md`);
			if (path === null) {
				return;
			}
			content
				.toString()
				.split("\n")
				.forEach((line, index) => {
					if (line.match("```") !== null || line.match("---") !== null) return;
					let rawContent: RawContent | null = null;
					if (isJapanese(line)) {
						const raw = toRomaji(line);
						const kenized = tokenize(line);
						const kanaizedRomaji = kenized.map((k) => toRomaji(toKana(k)));
						rawContent = {
							raw,
							separatedOriginal: kenized,
							separatedRaw: kanaizedRomaji,
						};
					}
					result.push({
						title,
						rawTitle,
						singleLineContent: line,
						lineAt: index,
						path,
						rawContent,
					});
				});
		});
		return result;
}
