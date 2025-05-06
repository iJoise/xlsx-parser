import { ColorModeButton } from '../theme/ColorModeButton'
import Paper from '@mui/material/Paper'
import { Button } from '@mui/material'
import CloudUploadRoundedIcon from '@mui/icons-material/CloudUploadRounded'
import { ChangeEvent } from 'react'
import { enqueueSnackbar } from 'notistack'
import * as XLSX from 'xlsx'
import { filteredXLSX, getUniqueArticleAndSumWithMergedColumns } from "../utils";
import Box from '@mui/material/Box'

type HeaderPropsType = {
  onFileLoad: (value: any[], type: 'old' | 'new') => void
  onClearState: () => void // Новый проп для очищения состояния
}

export default function Header({ onFileLoad, onClearState }: HeaderPropsType) {
  const handleFileUpload = async (e: ChangeEvent<HTMLInputElement>, type: 'old' | 'new') => {
    if (!e.target.files) {
      return
    }
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        try {
          const data = new Uint8Array(event?.target?.result as ArrayBufferLike)
          const workbook = XLSX.read(data, { type: 'array' })
          const sheetName = workbook.SheetNames[0]
          const sheet = workbook.Sheets[sheetName]
          const jsonData = XLSX.utils.sheet_to_json(sheet)
          const filteredData = filteredXLSX(jsonData, type)

          if (!filteredData.length) {
            enqueueSnackbar('Файл не содержит данных в ожидаемом формате', {
              variant: 'error'
            })
            return
          }

          const mergedData = getUniqueArticleAndSumWithMergedColumns(filteredData, type)

          if (!mergedData.length) {
            enqueueSnackbar('После обработки файла данные отсутствуют', {
              variant: 'error'
            })
            return
          }

          onFileLoad(mergedData, type)
          enqueueSnackbar('Успешная загрузка файла', {
            variant: 'success'
          })
        } catch (error) {
          console.error('Ошибка при обработке файла: ', error)
          enqueueSnackbar('Ошибка при обработке файла. Проверьте его структуру.', {
            variant: 'error'
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
      <Box sx={{ p: 2, display: 'flex' }}>
        <Button
          component="label"
          variant="outlined"
          color="secondary"
          startIcon={<CloudUploadRoundedIcon />}
          size="large"
          sx={{ marginRight: '1rem' }}
        >
          Загрузить файл XLS (старый)
          <input
            type="file"
            accept=".xlsx, .xls"
            hidden
            onChange={(e) => handleFileUpload(e, 'old')}
          />
        </Button>
        <Button
          component="label"
          variant="contained"
          color="success"
          startIcon={<CloudUploadRoundedIcon />}
          size="large"
          sx={{ marginRight: '1rem' }}
        >
          Загрузить файл XLS (новый)
          <input
            type="file"
            accept=".xlsx, .xls"
            hidden
            onChange={(e) => handleFileUpload(e, 'new')}
          />
        </Button>
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Button
          variant="contained"
          color="error"
          size="large"
          sx={{ marginRight: '1rem' }}
          onClick={onClearState} // Обработчик для очищения состояния
        >
          Очистить
        </Button>
        <ColorModeButton />
      </Box>
    </Paper>
  )
}
