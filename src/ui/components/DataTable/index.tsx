import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
  TableContainer,
  TableFooter,
} from "@mui/material";
import React from "react";
import _ from "lodash";
import styled from "@emotion/styled";

export interface TableColumnOption<T> {
  key: string;
  title?: React.ReactNode;
  render?: (row: T, rowIdx: number) => React.ReactNode;
  dataKey?: string;
  align?: "center" | "left" | "right" | "inherit" | "justify";
}

type Props<T> = {
  dataSource: T[];
  columns: TableColumnOption<T>[];
  rowKey: (row: T, idx: number) => string | number;
  onRowClick?: (
    e: React.MouseEvent<HTMLTableRowElement, MouseEvent>,
    row: T,
    idx: number
  ) => void;
  onRowContextMenu?: (
    e: React.MouseEvent<HTMLTableRowElement, MouseEvent>,
    row: T,
    idx: number
  ) => void;
};

export default class DataTable<T> extends React.Component<Props<T>> {
  render(): React.ReactNode {
    return (
      <TableContainer sx={{ flex: 1 }}>
        <Table size="small" stickyHeader>
          <TableHead>
            <TableRow>
              {this.props.columns.map((col) => (
                <StyledTableCell
                  sx={{ background: "#629ea1" }}
                  align={col.align}
                  key={col.key}
                >
                  <Typography fontWeight={700}>{col.title}</Typography>
                </StyledTableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {this.props.dataSource.map((row, idx) => {
              return (
                <StyledRow
                  isOdd={idx % 2 === 1}
                  onClick={
                    this.props.onRowClick
                      ? (e) => {
                          this.props.onRowClick?.(e, row, idx);
                        }
                      : undefined
                  }
                  onContextMenu={
                    this.props.onRowContextMenu
                      ? (e) => {
                          this.props.onRowContextMenu?.(e, row, idx);
                        }
                      : undefined
                  }
                  key={this.props.rowKey(row, idx)}
                >
                  {this.props.columns.map((col) => {
                    return (
                      <StyledTableCell
                        size="small"
                        key={col.key}
                        align={col.align}
                      >
                        {col.render
                          ? col.render(row, idx)
                          : typeof col.dataKey !== "undefined"
                          ? _.get(row, col.dataKey)
                          : null}
                      </StyledTableCell>
                    );
                  })}
                </StyledRow>
              );
            })}
          </TableBody>
          <TableFooter>
            {this.props.dataSource.length === 0 ? (
              <Typography textAlign="center" p={4} variant="body2">
                No data
              </Typography>
            ) : null}
          </TableFooter>
        </Table>
      </TableContainer>
    );
  }
}

const StyledRow = styled(TableRow, {
  shouldForwardProp: (prop) => prop !== "isOdd",
})<{ isOdd?: boolean }>`
  cursor: ${({ onClick }) => (onClick ? "pointer" : "inherit")};
  :hover {
    background-color: rgba(13, 136, 122, 0.1);
  }
  background-color: ${({ isOdd }) =>
    isOdd ? "rgba(203, 135, 135, 0.1)" : "rgba(4, 108, 142, 0.1)"};
`;

const StyledTableCell = styled(TableCell)`
  padding: ${({ theme }) => theme.spacing(1)};
`;
