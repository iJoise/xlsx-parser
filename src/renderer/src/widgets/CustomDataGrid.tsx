import { DataGrid, DataGridProps, GridColDef, GridRowsProp } from '@mui/x-data-grid'

type DataGripProps = DataGridProps & {
  rows: GridRowsProp
  loading: boolean
  columns: GridColDef[]
}

export function CustomDataGrid({ rows, loading, columns, ...data }: DataGripProps) {
  return (
    <DataGrid
      {...data}
      loading={loading}
      autoHeight
      rows={rows}
      columns={columns}
      getRowClassName={(params) => (params.indexRelativeToCurrentPage % 2 === 0 ? 'even' : 'odd')}
      density="standard"
      slotProps={{
        loadingOverlay: {
          variant: 'linear-progress',
          noRowsVariant: 'skeleton'
        }
      }}
    />
  )
}
