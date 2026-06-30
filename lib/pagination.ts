export type PaginationOptions = {
    currentPage: number;
    totalPages: number;
    siblingCount?: number;
    boundaryCount?: number;
}

function range(start: number, end: number): number[] {
    return Array.from({length: end - start + 1}, (_,i) => start + i)
}

export type PaginationItem = number | "...";

export function pagination({ currentPage, totalPages, siblingCount = 1, boundaryCount = 1 }: PaginationOptions) : PaginationItem[]{

    // Guard: if the whole list fits on the shelf, show every page — no ellipsis needed.
    const totalSlots = boundaryCount * 2 + siblingCount * 2 + 3;
    if (totalPages <= totalSlots) return range(1, totalPages);

    // Calculate boundaries first
    const leftBoundary = range(1, boundaryCount);
    const rightBoundary = range(totalPages - boundaryCount + 1, totalPages);

    // Calculate Siblings
    let startSibling = currentPage - siblingCount;
    let endSibling = currentPage + siblingCount;

    // Clamp the window so it can't slide off the list or collide with the boundaries.
    startSibling = Math.max(startSibling, boundaryCount + 2);
    endSibling = Math.min(endSibling, totalPages - boundaryCount - 1);

    // Build siblings
    const siblings = range(startSibling, endSibling);

    // Assemble: 5 pushes — boundary, separator, window, separator, boundary.
    // The separators are conditional ("..." vs a single filler number); the rest are always pushed.
    const paginationItems: PaginationItem[] = [];

    // 1. left boundary — always
    paginationItems.push(...leftBoundary);

    // 2. left separator — gap > 1 page → ellipsis; gap == 1 → show that page number
    if (startSibling > boundaryCount + 2) {
        paginationItems.push("...");
    } else {
        paginationItems.push(...range(boundaryCount + 1, startSibling - 1));
    }

    // 3. the window — always
    paginationItems.push(...siblings);

    // 4. right separator — mirror of the left
    if (endSibling < totalPages - boundaryCount - 1) {
        paginationItems.push("...");
    } else {
        paginationItems.push(...range(endSibling + 1, totalPages - boundaryCount));
    }

    // 5. right boundary — always
    paginationItems.push(...rightBoundary);

    return paginationItems;
}