import { useMemo } from 'react'

import { LemonSelect } from '@posthog/lemon-ui'

import { PropertyOperator, QuickFilterOption } from '~/types'

import { operatorsWithoutValues } from './quickFilterFormLogic'

interface QuickFilterSelectorProps {
    label: string
    options: QuickFilterOption[]
    value: string | null
    operator: PropertyOperator | null
    onChange: (value: string | null, operator: PropertyOperator | null) => void
}

export function QuickFilterSelector({
    label,
    options,
    value,
    operator,
    onChange,
}: QuickFilterSelectorProps): JSX.Element {
    const getOptionKey = (opt: QuickFilterOption): string => {
        return opt.value !== null ? `${opt.value}::${opt.operator}` : opt.operator
    }

    const currentKey = useMemo(() => {
        if (operator !== null && operatorsWithoutValues.includes(operator)) {
            return operator
        }
        if (value !== null) {
            return `${value}::${operator}`
        }
        return null
    }, [value, operator])

    const allOptions = useMemo(
        () => [
            { value: null, label: `Any ${label}` },
            ...options.map((opt) => ({
                value: getOptionKey(opt),
                label: opt.label,
            })),
        ],
        [options, label]
    )

    const displayValue = useMemo(() => {
        if (currentKey === null) {
            return null
        }
        return allOptions.some((opt) => opt.value === currentKey) ? currentKey : null
    }, [currentKey, allOptions])

    return (
        <LemonSelect
            value={displayValue}
            onChange={(selectedKey) => {
                if (selectedKey === null) {
                    onChange(null, null)
                } else {
                    const selected = options.find((opt) => getOptionKey(opt) === selectedKey)
                    if (selected) {
                        onChange(selected.value, selected.operator)
                    }
                }
            }}
            options={allOptions}
            size="small"
            placeholder={label}
            dropdownMatchSelectWidth={false}
        />
    )
}
