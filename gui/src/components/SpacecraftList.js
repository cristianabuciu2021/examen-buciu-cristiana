import { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'

import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'
import { Button } from 'primereact/button'
import { Dialog } from 'primereact/dialog'
import { InputText } from 'primereact/inputtext'
import { FilterMatchMode } from 'primereact/api'

import { getSpacecrafts, addSpacecraft, saveSpacecraft, deleteSpacecraft } from '../actions'

const spacecraftSelector = state => state.spacecraft.spacecraftList
const spacecraftCountSelector = state => state.spacecraft.count

function SpacecraftList () {
  const [isDialogShown, setIsDialogShown] = useState(false)
  const [name, setName] = useState('')
  const [maxSpeed, setMaxSpeed] = useState('')
  const [weight, setWeight] = useState('')
  const [isNewRecord, setIsNewRecord] = useState(true)
  const [selectedSpacecraft, setSelectedSpacecraft] = useState(null)
  const [filterString, setFilterString] = useState('')

  const [sortField, setSortField] = useState('')
  const [sortOrder, setSortOrder] = useState(1)

  const [filters, setFilters] = useState({
    maxSpeed: { value: null, matchMode: FilterMatchMode.GREATER_THAN_OR_EQUAL_TO },
    weight: { value: null, matchMode: FilterMatchMode.GREATER_THAN_OR_EQUAL_TO }
  })
  const [page, setPage] = useState(0)
  const [first, setFirst] = useState(0)

  const handleFilter = (evt) => {
    const oldFilters = filters
    oldFilters[evt.field] = evt.constraints.constraints[0]
    setFilters({ ...oldFilters })
  }

  const handleFilterClear = (evt) => {
    setFilters({
        maxSpeed: { value: null, matchMode: FilterMatchMode.GREATER_THAN_OR_EQUAL_TO },
        weight: { value: null, matchMode: FilterMatchMode.GREATER_THAN_OR_EQUAL_TO }
    })
  }

  useEffect(() => {
    const keys = Object.keys(filters)
    const computedFilterString = keys.map(e => {
      return {
        key: e,
        value: filters[e].value
      }
    }).filter(e => e.value).map(e => `${e.key}=${e.value}`).join('&')
    setFilterString(computedFilterString)
  }, [filters])

  const spacecrafts = useSelector(spacecraftSelector)
  const count = useSelector(spacecraftCountSelector)
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(getSpacecrafts(filterString, page, 3, sortField, sortOrder))
  }, [filterString, page, sortField, sortOrder])

  const handleAddClick = (evt) => {
    setIsDialogShown(true)
    setIsNewRecord(true)
    setName('')
    setMaxSpeed('')
    setWeight('')
  }

  const hideDialog = () => {
    setIsDialogShown(false)
  }

  const handleSaveClick = () => {
    if (isNewRecord) {
      dispatch(addSpacecraft({ name, maxSpeed, weight }))
    } else {
      dispatch(saveSpacecraft(selectedSpacecraft, { name, maxSpeed, weight}))
    }
    setIsDialogShown(false)
    setSelectedSpacecraft(null)
    setName('')
    setMaxSpeed('')
    setWeight('')
  }

  const editSpacecraft = (rowData) => {
    setSelectedSpacecraft(rowData.id)
    setName(rowData.name)
    setMaxSpeed(rowData.maxSpeed)
    setWeight(rowData.weight)
    setIsDialogShown(true)
    setIsNewRecord(false)
  }

  const handleDeleteSpacecraft = (rowData) => {
    dispatch(deleteSpacecraft(rowData.id))
  }

  const tableFooter = (
    <div>
      <Button label='Add' icon='pi pi-plus' onClick={handleAddClick} />
    </div>
  )

  const dialogFooter = (
    <div>
      <Button label='Save' icon='pi pi-save' onClick={handleSaveClick} />
    </div>
  )

  const opsColumn = (rowData) => {
    return (
      <>
        <Button label='Edit' icon='pi pi-pencil' onClick={() => editSpacecraft(rowData)} />
        <Button label='Delete' icon='pi pi-times' className='p-button p-button-danger' onClick={() => handleDeleteSpacecraft(rowData)} />
      </>
    )
  }

  const handlePageChange = (evt) => {
    setPage(evt.page)
    setFirst(evt.page * 3)
  }

  const handleSort = (evt) => {
    console.warn(evt)
    setSortField(evt.sortField)
    setSortOrder(evt.sortOrder)
  }

  return (
    <div>
      <DataTable
        value={spacecrafts}
        footer={tableFooter}
        lazy
        paginator
        onPage={handlePageChange}
        first={first}
        rows={3}
        totalRecords={count}
        onSort={handleSort}
        sortField={sortField}
        sortOrder={sortOrder}
      >
        <Column header='Name' field='name'  />
        <Column header='Max Speed' field='maxSpeed' filter filterMatchMode='gte' filterField='maxSpeed' filterPlaceholder='filter by maxSpeed' onFilterApplyClick={handleFilter} onFilterClear={handleFilterClear} sortable />
        <Column header='Weight' field='weight' filter filterMatchMode='gte' filterField='weight' filterPlaceholder='filter by weight' onFilterApplyClick={handleFilter} onFilterClear={handleFilterClear} sortable />
        <Column body={opsColumn} />
      </DataTable>
      <Dialog header='A spacecraft' visible={isDialogShown} onHide={hideDialog} footer={dialogFooter}>
        <div>
          <InputText placeholder='Name' onChange={(evt) => setName(evt.target.value)} value={name} />
        </div>
        <div>
          <InputText placeholder='Max Speed' onChange={(evt) => setMaxSpeed(evt.target.value)} value={maxSpeed} />
        </div>
        <div>
          <InputText placeholder='Weight' onChange={(evt) => setWeight(evt.target.value)} value={weight} />
        </div>
      </Dialog>
    </div>
  )
}

export default SpacecraftList