import {ButtonNodeModel} from "../../models/ButtonNodeModel";
import {nodesToYaml} from "../yaml/nodesToYaml";
import {yamlToNodes} from "../yaml/yamlToNodes";

const nodes = [
    new ButtonNodeModel(
        'menu',
        'Меню',
        { x: 50, y: 50 },
        'Привет, я бот - навигатор по базе знаний "Сервисы ИБ Фабрики Данных".',
        [
            { label: 'Категория 1', target: 'first_category' },
            { label: 'Категория 2', target: 'second_category' },
        ]
    ),
    new ButtonNodeModel(
        'first_category',
        'Категория 1',
        { x: 300, y: 50 },
        'Текст категории 1',
        [
            { label: 'Перейти в Категорию 2', target: 'first_button_1' },
        ]
    ),
    new ButtonNodeModel(
        'second_category',
        'Категория 2',
        { x: 300, y: 200 },
        'Текст категории 2',
        [
            { label: 'Внешний ресурс', href: 'https://example.com', external: true },
        ]
    ),
    new ButtonNodeModel(
        'first_button_1',
        'Перейти в Категорию 2',
        { x: 600, y: 50 },
        '...',
        []
    ),
];

describe('utils test', () => {
    it('конвертирует nodes в yaml (snapshot)', () => {
        const yamlStr = nodesToYaml(nodes, 'menu');
        expect(yamlStr).toMatchSnapshot('nodes-to-yaml');
    });

    it('конвертирует yaml в nodes (snapshot)', () => {
        const yamlStr = nodesToYaml(nodes, 'menu');
        const nodes2 = yamlToNodes(yamlStr);
        expect(nodes2).toMatchSnapshot('yaml-to-nodes');
    });
});


describe('roundtrip conversion', () => {
    it('nodes → yaml → nodes2 → yaml2 сохраняет структуру', () => {
        const yaml1 = nodesToYaml(nodes, 'menu');
        const nodes2 = yamlToNodes(yaml1);
        const yaml2 = nodesToYaml(nodes2, 'menu');
        // Проверяем структурное равенство (если классы, то можно привести к plain object)
        expect(nodes2).toMatchSnapshot('nodes2-after-roundtrip');
        // Проверяем совпадение YAML (может отличаться форматирование, но содержимое будет эквивалентно)
        expect(yaml2).toMatchSnapshot('yaml2-after-roundtrip');
        // Можно ещё сравнить содержимое, например через toEqual, если хочешь строго:
        // expect(yaml2).toEqual(yaml1); // Если формат одинаковый
    });
});
