"use client";

import { useState } from "react";
import { Box, Button, Card, CardContent, Typography, Grid, Chip, CircularProgress, Divider, Collapse, IconButton } from "@mui/material";
import { PlayArrow, Clear, Refresh, ExpandMore, ExpandLess } from "@mui/icons-material";

import { useUnitTest } from "./useUnitTest";
import { logjs, providers } from "@lib/client";
import { TestDialogGrid, TestDialogCard, TestDialogTitle, TestDialogDescription, CodeBlock, ResultContainer, ErrorContainer } from "./styles";
import { useEffect } from "react";

const { useWebAppContext } = providers;
const log = new logjs("DaoUnitTestPage");

/**
 * DAO Unit Test ページ
 * 各DAOファイルのfind関数の動作確認を行うページ
 */
export default function DaoUnitTestPage() {
  const webAppContext = useWebAppContext();
  const { state, actions } = webAppContext || {};
  log.info("state", state);
  log.info("actions", actions);
  const [formData, formProps] = useUnitTest({}, state, actions);
  const [expandedResults, setExpandedResults] = useState({});

  const { testResults = {}, loading = {}, daoList = [] } = formData;
  const { executeDaoTest, executeAllTests, clearResults } = formProps;

  // エラーの件数を計算
  const errorCount = Object.values(testResults).filter((result) => !result.success).length;

  // ページタイトルを設定
  useEffect(() => {
    if (actions) {
      actions.setPageTitle("DAO Unit Test");
    }
  }, [actions]);

  const toggleResultExpansion = (daoName) => {
    setExpandedResults((prev) => ({
      ...prev,
      [daoName]: !prev[daoName],
    }));
  };

  return (
    <Box>
      <Box sx={{ mb: 3, display: "flex", gap: 2, alignItems: "center" }}>
        <Button variant="contained" startIcon={<PlayArrow />} onClick={executeAllTests} disabled={Object.values(loading).some((l) => l)} sx={{ minWidth: 200 }}>
          すべてのDAOテストを実行
        </Button>

        <Button variant="outlined" startIcon={<Clear />} onClick={clearResults} disabled={Object.keys(testResults).length === 0}>
          結果をクリア
        </Button>

        <Chip label={`実行済み: ${Object.keys(testResults).length}/${daoList.length}`} color="primary" variant="outlined" />
        {errorCount > 0 && <Chip label={`エラー: ${errorCount}`} color="error" variant="outlined" />}
      </Box>

      <TestDialogGrid>
        {daoList.map((daoName) => {
          const result = testResults[daoName];
          const isLoading = loading[daoName];
          const isExpanded = expandedResults[daoName];

          return (
            <TestDialogCard key={daoName}>
              <TestDialogTitle>{daoName}</TestDialogTitle>
              <TestDialogDescription>{daoName}のfind関数をテストします</TestDialogDescription>

              <Box sx={{ mt: 2, display: "flex", gap: 1, alignItems: "center" }}>
                <Button
                  variant="contained"
                  size="small"
                  onClick={() => executeDaoTest && executeDaoTest(daoName)}
                  disabled={isLoading}
                  startIcon={isLoading ? <CircularProgress size={16} /> : <PlayArrow />}
                >
                  {isLoading ? "実行中..." : "テスト実行"}
                </Button>

                {result && <Chip label={result.success ? "成功" : "エラー"} color={result.success ? "success" : "error"} size="small" />}
              </Box>

              {result && (
                <Box sx={{ mt: 2 }}>
                  <Divider sx={{ mb: 2 }} />

                  <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 1 }}>
                    <Typography variant="subtitle2">実行時刻: {result.timestamp}</Typography>
                    <IconButton size="small" onClick={() => toggleResultExpansion(daoName)} sx={{ ml: 1 }}>
                      {isExpanded ? <ExpandLess /> : <ExpandMore />}
                    </IconButton>
                  </Box>

                  <Collapse in={isExpanded}>
                    {result.success ? (
                      <ResultContainer>
                        <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: "bold" }}>
                          実行結果:
                        </Typography>
                        <CodeBlock>{JSON.stringify(result.data, null, 2)}</CodeBlock>
                      </ResultContainer>
                    ) : (
                      <ErrorContainer>
                        <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: "bold" }}>
                          エラー内容:
                        </Typography>
                        <Typography variant="body2">{result.error}</Typography>
                      </ErrorContainer>
                    )}
                  </Collapse>
                </Box>
              )}
            </TestDialogCard>
          );
        })}
      </TestDialogGrid>
    </Box>
  );
}
