import { CUIAutoComplete } from 'chakra-ui-autocomplete'
import React from 'react'
interface MultipleUserProps {
  data: any
  loading: boolean
  values: (field: string, value: any, shouldValidate?: boolean) => void
  currentUserId: number
}

export interface Item {
  label: string
  value: string
}

export const MultipleUser: React.FC<MultipleUserProps> = ({
  data,
  loading,
  values,
  currentUserId,
}) => {
  if (loading) {
    return null
  }
  const { getTeamMembers } = data
  const testData = getTeamMembers.map((t) => {
    return { value: t.id, label: t.username }
  })
  const actualData = testData.filter((t) => t.value !== currentUserId)

  const [pickerItems, _] = React.useState(actualData)
  const [selectedItems, setSelectedItems] = React.useState<Item[]>([])

  const handleSelectedItemsChange = (selectedItems?: Item[]) => {
    if (selectedItems) {
      setSelectedItems(selectedItems)
      values('members', selectedItems)
    }
  }

  return (
    <CUIAutoComplete
      label="add channel members"
      placeholder="add member"
      items={pickerItems}
      selectedItems={selectedItems}
      onSelectedItemsChange={(changes) => {
        handleSelectedItemsChange(changes.selectedItems)
      }}
    />
  )
}
