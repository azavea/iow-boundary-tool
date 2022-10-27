const TAGS = {
    BOUNDARY: 'boundary',

    LIST_ID: 'list',
};

export function getListTagProvider(tag) {
    return results => [
        ...results.map(({ id }) => ({ tag, id })),
        { tag, id: TAGS.LIST_ID },
    ];
}

export function getSingleItemProvider(tag) {
    return (result, error, id) => [{ tag, id }];
}

export function getNewItemTagInvalidator(tag) {
    return () => [{ tag, id: TAGS.LIST_ID }];
}

export function getUpdateItemTagInvalidator(tag) {
    return (result, error, { id }) => [{ tag, id }];
}

export default TAGS;
