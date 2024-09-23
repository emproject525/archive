import React, { useCallback, useEffect, useState } from 'react';
import { useRecoilValue } from 'recoil';
import { Box, Grid, Paper, Typography } from '@mui/material';
import { Canvas, Gradient, Rect } from 'fabric';

import TextList from 'pages/text/List/TextList';
import PhotoList from 'pages/photo/List';
import VideoList from 'pages/video/List';
import AudioList from 'pages/audio/List';
import MiniTitle from 'components/Text/MiniTitle';

import { latestKeywordsState } from './state';

// 대시보드
// (좌측) 최신 문서 5개, 최신 사진 6개
// (우측) 최근 검색어 5개, 최신 영상 3개, 최신 오디오 3개
const Dashboard = () => {
  const keywords = useRecoilValue(latestKeywordsState);
  const [canvas, setCanvas] = useState<Canvas | undefined>();
  const canvasRefCallback = useCallback(
    (ele: HTMLCanvasElement | null) => {
      if (ele) {
        const c =
          canvas ??
          new Canvas(ele, {
            width: 18,
            height: 18,
            selection: false,
            allowTouchScrolling: false,
          });
        setCanvas(c);

        const draw = (heights: number[]) => {
          const rects = heights.map(
            (h, idx) =>
              new Rect({
                top: (18 - h) / 2,
                left: 2 + idx * (2 + 1),
                width: 1,
                height: h,
                scaleX: 1,
                scaleY: 1,
                objectCaching: false,
                rx: 1,
                ry: 1,
              }),
          );
          rects.forEach((rect) => {
            rect.set(
              'fill',
              new Gradient({
                type: 'linear',
                coords: {
                  x1: 0,
                  y1: -rect.height / 2,
                  x2: 0,
                  y2: rect.height / 2,
                },
                colorStops: [
                  { offset: 0, color: 'pink' },
                  { offset: 0.5, color: 'red' },
                  { offset: 1, color: 'orange' },
                ],
              }),
            );
          });
          c.clear();
          c.add(...rects);
        };

        const hs = [3, 3, 3, 3, 3];
        draw(hs);
        setInterval(() => {
          const random = Math.floor(Math.random() * (14 - 3 + 1) + 3);
          hs.shift();
          hs.push(random);
          draw(hs);
        }, 200);
      }
    },
    [canvas],
  );

  useEffect(() => {
    return () => {
      canvas?.dispose();
    };
  }, [canvas]);

  return (
    <Grid container spacing={6}>
      <Grid item xs={12} lg={8}>
        <Box display="flex" flexDirection="column" gap={6}>
          <TextList
            title="문서 아카이브 현황"
            suppressSearch
            suppressMoreButton
            suppressCheckbox
            size={5}
          />
          <PhotoList
            title="사진 아카이브 현황"
            suppressSearch
            suppressMoreButton
            size={6}
          />
          <Box
            display="flex"
            alignItems="center"
            justifyContent="center"
            width={40}
            height={40}
            borderRadius="100%"
            bgcolor="black"
          >
            <canvas ref={canvasRefCallback} style={{ pointerEvents: 'none' }} />
          </Box>
        </Box>
      </Grid>
      <Grid item xs={12} lg={4}>
        {/* 4 */}
        <Box display="flex" flexDirection="column" gap={6}>
          <Paper
            sx={{
              px: 4,
            }}
          >
            <MiniTitle text="최근 검색어" />
            <Box
              display="flex"
              flexDirection="column"
              gap={1}
              sx={{
                mt: 2,
                float: 'left',
              }}
              width="100%"
            >
              {keywords.map((item, idx) => (
                <Box
                  key={`keyword-${idx}`}
                  display="flex"
                  justifyContent="space-between"
                  gap={2}
                  sx={{
                    cursor: 'pointer',
                  }}
                  width="100%"
                >
                  <Typography
                    variant="fs13"
                    color="grey.700"
                    title={`${item.keyword} 통합 검색 페이지로 이동`}
                  >
                    {item.keyword}
                  </Typography>
                  <Typography variant="fs13" color="grey.500">
                    {item.regDt}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Paper>
          <VideoList
            suppressMoreButton
            suppressSearch
            title="영상 아카이브 현황"
            size={3}
            rowCount={1}
          />
          <AudioList
            suppressMoreButton
            suppressSearch
            title="오디오 아카이브 현황"
            size={3}
            rowCount={1}
          />
        </Box>
      </Grid>
    </Grid>
  );
};

export default Dashboard;
