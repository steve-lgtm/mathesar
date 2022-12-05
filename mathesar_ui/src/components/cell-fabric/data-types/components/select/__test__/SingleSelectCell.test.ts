import { render } from '@testing-library/svelte'
import '@testing-library/jest-dom'
import SingleSelectCell from '../SingleSelectCell.svelte'

test("SingleSelectCell check props",() => {
    const {container} = render(SingleSelectCell,{
        props:{
            isActive:true,
            disabled:false,
            isSelectedInRange:false,
            value:'hodnota',

        }
    })
    expect(() => container).not.toThrow();
    const cellWrapper = container.querySelector(".cell-wrapper")
    const value = cellWrapper.querySelector('.value')
    expect(value).toHaveTextContent('hodnota')
    expect(cellWrapper).toBeInTheDocument()
    expect(cellWrapper).not.toHaveClass('disabled')
    expect(cellWrapper).toHaveClass('is-active')
    expect(cellWrapper).not.toBeEmptyDOMElement()

})