export default function preprocessCustomMarkdown(text: string): string {
    // жирный *текст* → **текст**
    text = text.replace(/\*([^*]+)\*/g, '**$1**');
    // курсив _текст_ → *текст*
    text = text.replace(/_([^_]+)_/g, '*$1*');
    // зачеркнутый ~текст~ → ~~текст~~
    text = text.replace(/~([^~]+)~/g, '~~$1~~');
    // код `code`
    // не изменяем
    // цитата > цитата — не изменяем
    // ссылки [текст](url) — не изменяем
    return text;
}
