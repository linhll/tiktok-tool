import {
  Container,
  Typography,
  Button,
  Box,
  SvgIcon,
  Grid,
  Menu,
  MenuItem,
  ListItemIcon,
  Dialog,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { useEffect, useState } from "react";
import DataTable from "../components/DataTable";
import styled from "@emotion/styled";
import { importDataFromFileAsync } from "../utils/data";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import Checkbox from "@mui/material/Checkbox";
import { db } from "../db";
import ProxySetting from "../components/SettingDialog/components/ProxySetting";
import { mdiDeleteOutline, mdiImport, mdiTrashCanOutline } from "@mdi/js";
import LoginButton from "../components/LoginButton";
import StatusText from "../components/StatusText";
import { useSnackbar } from "notistack";

export default function ToolsPage() {
  const [loading, setLoading] = useState(false);
  const [reloadTime, setReloadTime] = useState(0);
  const [contextMenuData, setAnchorPosition] = useState<
    { x: number; y: number; row: TiktokAccount } | undefined
  >(undefined);
  const [deleted, setDeleted] = useState<TiktokAccount | undefined>(undefined);
  const [data, setData] = useState<TiktokAccount[]>([]);
  useEffect(() => {
    setLoading(true);
    db.tiktoks
      .toArray()
      .then(setData)
      .finally(() => {
        setLoading(false);
      });
  }, [reloadTime]);
  const { enqueueSnackbar } = useSnackbar();

  return (
    <Root>
      <Grid container>
        <Grid
          item
          p={2}
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-end",
          }}
        >
          <Button
            component="label"
            variant="contained"
            color="secondary"
            size="small"
            startIcon={
              <SvgIcon fontSize="inherit">
                <path d={mdiImport} />
              </SvgIcon>
            }
          >
            Import data
            <input
              hidden
              type="file"
              name="import_file"
              onChange={(e) => {
                const file = e.currentTarget.files?.[0];
                if (file) {
                  e.currentTarget.value = "";

                  setLoading(true);
                  importDataFromFileAsync(file)
                    .then((arr) => {
                      enqueueSnackbar({
                        variant: "success",
                        message: `Import thành công ${arr.length} tài khoản.`,
                      });
                    })
                    .catch((err) => {
                      enqueueSnackbar({
                        variant: "error",
                        message: err.message,
                      });
                    })
                    .finally(() => {
                      setReloadTime(Date.now());
                      setLoading(false);
                    });
                }
              }}
            />
          </Button>
          <Button
            variant="outlined"
            size="small"
            sx={{ ml: 1 }}
            color="error"
            onClick={(e) => {
              const res = confirm(
                "This action cannot reverse. Do you want to clear all data?"
              );
              if (res) {
                setLoading(true);

                db.tiktoks.clear().finally(() => {
                  setLoading(false);
                  setReloadTime(Date.now());
                });
              }
            }}
            startIcon={
              <SvgIcon>
                <path d={mdiTrashCanOutline} />
              </SvgIcon>
            }
          >
            Clear Data
          </Button>
        </Grid>
      </Grid>

      {data ? (
        <DataTable
          dataSource={data}
          columns={[
            // {
            //   key: "select",
            //   title: () =>{
            //     return <Checkbox onChange={(e, checked) =>{

            //     }} />
            //   },
            //   align: "right",
            //   render: (row, rowIdx) => <Typography>{rowIdx + 1}</Typography>,
            // },
            {
              key: "NO",
              title: "NO.",
              align: "right",
              render: (row, rowIdx) => <Typography>{rowIdx + 1}</Typography>,
            },
            {
              key: "email",
              title: "Email",
              render: (row, rowIdx) => <Typography>{row.email}</Typography>,
            },
            {
              key: "currency",
              title: "Currency",
              align: "center",
              render: (row, rowIdx) => <Typography>{row.currency}</Typography>,
            },
            {
              key: "2FA",
              title: "2FA",
              align: "center",
              render: (row, rowIdx) => (
                <Checkbox
                  checked={row.twoFaEnabled}
                  size="small"
                  disableRipple
                  sx={{ cursor: "inherit" }}
                />
              ),
            },
            // {
            //   key: "2fa_secret",
            //   title: "2FA Secret",
            //   render: (row, rowIdx) => <Typography>{row.secret}</Typography>,
            // },

            {
              key: "status",
              title: "Status",
              align: "center",
              render: (row, rowIdx) => (
                <StatusText uid={row.uid} initStatus={row.status} />
              ),
            },
            {
              key: "action",
              title: "Action",
              align: "center",
              render: (row, rowIdx) => <LoginButton account={row} />,
            },
          ]}
          rowKey={(row) => row.email}
          onRowContextMenu={(ev, row) => {
            setAnchorPosition({
              row,
              x: ev.pageX,
              y: ev.pageY,
            });
          }}
        />
      ) : null}
      <Box
        sx={{
          background: (theme) => theme.palette.primary.main,
          p: 0.5,
          pl: 1,
        }}
      >
        <Typography
          fontFamily="monospace"
          fontSize={12}
          color={(theme) => theme.palette.common.white}
        >
          Total: <b>{data.length}</b> accounts
        </Typography>
      </Box>
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={loading || !data}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      <Menu
        MenuListProps={{
          dense: true,
        }}
        onClose={() => {
          setAnchorPosition(undefined);
        }}
        open={!!contextMenuData}
        anchorReference="anchorPosition"
        onContextMenu={() => {
          setAnchorPosition(undefined);
        }}
        anchorPosition={
          contextMenuData
            ? {
                top: contextMenuData?.y ?? 0,
                left: contextMenuData?.x ?? 0,
              }
            : undefined
        }
      >
        <MenuItem
          sx={{
            minWidth: 128,
            pl: 1,
            pr: 1,
          }}
          onClick={() => {
            setDeleted(contextMenuData?.row);
            setAnchorPosition(undefined);
          }}
        >
          <ListItemIcon>
            <SvgIcon>
              <path d={mdiDeleteOutline} />
            </SvgIcon>
          </ListItemIcon>
          <Typography>Delete</Typography>
        </MenuItem>
      </Menu>
      <Dialog open={!!deleted}>
        <DialogContent>
          Do you want to delete <b>{deleted?.email}</b>?
        </DialogContent>
        <DialogActions>
          <Button
            size="small"
            variant="contained"
            onClick={() => {
              setDeleted(undefined);
            }}
          >
            No
          </Button>
          <Button
            size="small"
            color="error"
            variant="outlined"
            onClick={() => {
              if (deleted) {
                db.deleteAsync(deleted.uid).then(() =>
                  setReloadTime(Date.now())
                );
              }
              setDeleted(undefined);
            }}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Root>
  );
}

const Root = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
`;
