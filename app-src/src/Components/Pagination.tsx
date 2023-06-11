import { OrderBy } from './OrderBy'
import { SelectPage } from './SelectPage'
import { SignFilter } from './SignFilter'

export function Pagination({
    offset,
    totalPages,
    totalSignCount,
    updatePage,
    limit,
    currentPage,
}: {
    offset: number
    totalPages: number
    totalSignCount: number
    updatePage: (page: number) => void
    limit: number
    currentPage: number
}) {
    const signCountOnPage = Math.min(totalSignCount - offset, limit)
    const paginationLinkCount = 4
    const firstLink = currentPage < 3 ? 1 : currentPage - 2
    const showFirstLink = currentPage < firstLink
    const maxLastLink = totalPages
    const lastLink = Math.min(maxLastLink, firstLink + paginationLinkCount)
    let linkArr = []
    const realLinkCount = Math.min(paginationLinkCount, lastLink - firstLink)
    const showLastLink = totalPages >= firstLink + realLinkCount
    for (
        let i = firstLink;
        i <=
        firstLink +
            realLinkCount -
            Number(showFirstLink) -
            Number(showLastLink);
        i++
    ) {
        linkArr.push(i)
    }
    // < 1 2 3 4 5 6 ... 121 >
    return (
        <>
            <div
                key={currentPage}
                className=""
                style={{
                    padding: '0rem 1rem',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                }}
            >
                <div>
                    Sýni tákn {totalSignCount > 0 ? offset + 1 : 0}-
                    {offset + signCountOnPage} af {totalSignCount}.
                </div>
                <SignFilter />
                <div>
                    <OrderBy />
                </div>
            </div>
            {totalPages > 1 && (
                <div className="pagination">
                    <a
                        onClick={() => updatePage(Math.max(1, currentPage - 1))}
                        className=""
                    >
                        &lt;
                    </a>
                    {firstLink != 1 && (
                        <a onClick={() => updatePage(1)} className="">
                            1
                        </a>
                    )}
                    {/* <a onClick={() => updatePage(firstLink)} className="">
                    {firstLink}
                </a> */}
                    {linkArr.map((index) => {
                        return (
                            <a
                                key={index}
                                className={index == currentPage ? 'active' : ''}
                                onClick={() => updatePage(index)}
                            >
                                {index}
                            </a>
                        )
                    })}

                    {/* <a className="active">{currentPage}</a> */}
                    <SelectPage
                        totalPages={totalPages}
                        updatePage={updatePage}
                    />
                    {/* <a onClick={() => alert('velja')} className="">
                        ...
                    </a> */}
                    {showLastLink && (
                        <a
                            onClick={() => updatePage(totalPages)}
                            className={
                                currentPage == totalPages ? 'active' : ''
                            }
                        >
                            {totalPages}
                        </a>
                    )}
                    <a
                        onClick={() =>
                            updatePage(Math.min(totalPages, currentPage + 1))
                        }
                    >
                        &gt;
                    </a>
                </div>
            )}
        </>
    )
}
