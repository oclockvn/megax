"use client";

import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import PlayCircleIcon from "@mui/icons-material/PlayCircle";
import PauseCircleIcon from "@mui/icons-material/PauseCircle";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CloseIcon from "@mui/icons-material/Close";
import AddIcon from "@mui/icons-material/Add";
import FlagIcon from '@mui/icons-material/Flag';
import Grid from "@mui/material/Grid";
import Checkbox from "@mui/material/Checkbox";

export default function Personal() {
  const todos = [1, 2, 3, 4, 5];

  return (
    <>
      <Grid container alignItems="center" justifyContent="center">
        <h2 className="text-[3rem] font-bold">01:15</h2>
        <Grid container alignItems="center" justifyContent="center" gap={2}>
          <IconButton color="success">
            <PlayCircleIcon />
          </IconButton>
          <IconButton color="secondary">
            <PauseCircleIcon />
          </IconButton>
        </Grid>
      </Grid>

      {todos.map(i => (
        <div
          key={i}
          className="py-2 mb-2 bg-slate-100 border-b border-s rounded overflow-hidden"
        >
          <Grid
            container
            alignItems="center"
            className="px-4 py-2 border-l-4 border-fuchsia-500"
          >
            <Grid item flex={1}>
              <a className="text-sm text-blue-500" href="#">
                TALLY-1234
              </a>
              <div className="font-bold">Lorem ipsum dolor sit amet.</div>
            </Grid>
            <Grid item>
              <div className="font-bold">01:15</div>
            </Grid>
          </Grid>
          <div className="mx-4 mt-2">
            {[1,2,3].map(j => (
              <div key={j} className="border-b border-solid last:border-none">
                <Grid container alignItems={"center"} spacing={1}>
                  <Grid item>
                    <Checkbox
                      icon={<RadioButtonUncheckedIcon />}
                      checkedIcon={<CheckCircleIcon />}
                    />
                  </Grid>
                  <Grid item flex={1} fontSize={".8rem"}>
                    Lorem ipsum
                  </Grid>
                  <Grid item>
                    <IconButton title="Red flag">
                      <FlagIcon fontSize="small" />
                    </IconButton>
                    <IconButton color="warning">
                      <CloseIcon fontSize="small" />
                    </IconButton>
                  </Grid>
                </Grid>
              </div>
            ))}

            <div className="mt-2">
              <Button variant="text" startIcon={<AddIcon />} className="!px-4">
                Next step
              </Button>
            </div>
          </div>
        </div>
      ))}
    </>
  );
}
