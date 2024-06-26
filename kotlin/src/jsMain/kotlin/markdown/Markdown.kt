package markdown

import DependencyData
import FileNameInfo
import FileNameString
import external.CodeEncoder
import external.MermaidRender
import external.NextRouter
import external.TexRender
import markdown.processor.element.createReactElementGeneratingProcessors
import org.intellij.markdown.parser.LinkMap
import org.intellij.markdown.parser.MarkdownParser
import react.FC
import react.Props

fun convertMarkdownToReactElement(fileName: FileNameString, content: String, dependencyData: DependencyData, fileNameInfo: FileNameInfo, router: NextRouter?, codeEncoder: CodeEncoder?, mermaidRender: MermaidRender?, texRender: TexRender?): FC<Props> {
    val flavour = ObsidianMarkFlavourDescriptor()
    val parsedTree = MarkdownParser(flavour).buildMarkdownTreeFromString(content)
    return ReactElementGenerator(content, parsedTree, createReactElementGeneratingProcessors(LinkMap.buildLinkMap(parsedTree, content), null, fileName, router, codeEncoder, mermaidRender, texRender, dependencyData, fileNameInfo)).generateElement()
}
