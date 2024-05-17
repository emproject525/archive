import ArchiveTwoToneIcon from '@mui/icons-material/ArchiveTwoTone';
import { Box, useTheme } from '@mui/material';

/**
 * 아카이브됨
 * @returns JSX.Element
 */
const Archived = () => {
  const theme = useTheme();

  return (
    <Box display="flex" alignItems="center" color={theme.palette.success.main}>
      <ArchiveTwoToneIcon
        sx={{
          color: theme.palette.success.main,
          fontSize: 16,
        }}
      />
    </Box>
  );
};

export default Archived;
