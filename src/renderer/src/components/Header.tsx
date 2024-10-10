import Stack from '@mui/material/Stack'
import { ColorModeButton } from '../theme/ColorModeButton'
import Paper from '@mui/material/Paper'
import { Button } from '@mui/material'
import CloudUploadRoundedIcon from '@mui/icons-material/CloudUploadRounded'
import { ChangeEvent } from 'react'
import { enqueueSnackbar } from 'notistack'
import * as XLSX from 'xlsx'
import { filteredXLSX, getUnicArticleAndSum } from '../utils'

type HeaderPropsType = {
  onFileLoad: (value: any[]) => void
  setFileName: (value: string) => void
}

export default function Header({ onFileLoad, setFileName }: HeaderPropsType) {
  const handleFileUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) {
      return
    }
    const file = e.target.files[0]
    if (file) {
      setFileName(file.name)

      const reader = new FileReader()
      reader.onload = (event) => {
        const data = new Uint8Array(event?.target?.result as ArrayBufferLike)
        const workbook = XLSX.read(data, { type: 'array' })
        const sheetName = workbook.SheetNames[0]
        const sheet = workbook.Sheets[sheetName]
        const jsonData = XLSX.utils.sheet_to_json(sheet)
        const filteredData = filteredXLSX(jsonData)

        if (filteredData.length) {
          const mergedData = getUnicArticleAndSum(filteredData)

          onFileLoad(mergedData)

          enqueueSnackbar('Загрузка успешно', {
            variant: 'success'
          })
        }
      }
      reader.readAsArrayBuffer(file)
    }
  }

  return (
    <Paper
      elevation={3}
      sx={{
        display: 'flex',
        width: '100%',
        justifyContent: 'space-between',
        px: 5
      }}
    >
      <Stack sx={{ p: 2 }}>
        <Button
          component="label"
          variant="outlined"
          color="secondary"
          startIcon={<CloudUploadRoundedIcon />}
          size="large"
          sx={{ marginRight: '1rem' }}
        >
          Загрузить файл XLS
          <input type="file" accept=".xlsx, .xls" hidden onChange={handleFileUpload} />
        </Button>
      </Stack>
      <ColorModeButton />
    </Paper>
  )
}
