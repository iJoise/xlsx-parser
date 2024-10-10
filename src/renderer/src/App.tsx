import type {} from '@mui/x-data-grid/themeAugmentation'
import type {} from '@mui/material/themeCssVarsAugmentation'
import { alpha } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import Box from '@mui/material/Box'
import { AppTheme } from './theme/AppTheme'
import { dataGridCustomizations } from './theme/customizations'
import Header from './components/Header'
import { useEffect, useMemo, useState } from 'react'
import { CustomDataGrid } from './widgets/CustomDataGrid'
import { GridColDef } from '@mui/x-data-grid'
import * as XLSX from 'xlsx'
import Button from '@mui/material/Button'
import dayjs from 'dayjs'

const xThemeComponents = {
  ...dataGridCustomizations
}

function App(props: { disableCustomTheme?: boolean }) {
  const [parsedXLSX, setParsedXLSX] = useState<any[]>([])
  const loading = false

  useEffect(() => {
    console.log(parsedXLSX)
  }, [parsedXLSX])

  const columns: GridColDef[] = useMemo(() => {
    if (parsedXLSX.length) {
      const col: GridColDef[] = Object.keys(parsedXLSX[0])
        .filter((item) => item !== 'id')
        .map((key) => ({
          field: key,
          headerName: key,
          description: key,
          flex: 1
        }))

      return col
    }

    return []
  }, [parsedXLSX])

  const handleExport = (): void => {
    const exportData = parsedXLSX.map(({ id, ...rest }) => rest)
    const worksheet = XLSX.utils.json_to_sheet(exportData)

    worksheet['!cols'] = [{ wch: 25 }, { wch: 48 }, { wch: 50 }, { wch: 38 }, { wch: 40 }]

    const workbook = XLSX.utils.book_new()

    XLSX.utils.book_append_sheet(workbook, worksheet, 'Таблица')

    XLSX.writeFile(workbook, `Отчёт от ${dayjs().format('DD-MM-YYYY.HH:mm')}.xlsx`)
  }

  const onFileLoad = (data: any[]) => {
    const res = data.sort((a, b) => a['Артикул'].localeCompare(b['Артикул']))
    setParsedXLSX(res)
  }

  return (
    <AppTheme {...props} themeComponents={xThemeComponents}>
      <CssBaseline enableColorScheme />
      <Box
        component="main"
        sx={(theme) => ({
          flexGrow: 1,
          backgroundColor: theme.vars
            ? `rgba(${theme.vars.palette.background.defaultChannel} / 1)`
            : alpha(theme.palette.background.default, 1),
          overflow: 'auto'
        })}
      >
        <Header onFileLoad={onFileLoad} />
        <Box sx={{ p: 5 }}>
          <Box sx={{ mb: 2, display: 'flex', justifyContent: 'flex-end' }}>
            <Button
              variant="contained"
              color="primary"
              disabled={!parsedXLSX.length}
              onClick={handleExport}
            >
              Экспорт в XLSX
            </Button>
          </Box>
          <CustomDataGrid
            columns={columns}
            rows={parsedXLSX}
            loading={loading}
            sx={{
              '& .MuiDataGrid-columnHeaderTitle': {
                whiteSpace: 'normal',
                lineHeight: 'normal'
              },
              '& .MuiDataGrid-columnHeader': {
                height: 'unset !important'
              },
              '& .MuiDataGrid-columnHeaders': {
                maxHeight: '200px !important'
              },
              '& .MuiDataGrid-columnHeaderTitleContainer': {
                minHeight: '50px !important'
              }
            }}
          />
        </Box>
      </Box>
    </AppTheme>
  )
}

export default App
