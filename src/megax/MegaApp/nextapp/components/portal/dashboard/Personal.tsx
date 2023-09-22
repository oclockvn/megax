"use client";

import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import PlayCircleIcon from "@mui/icons-material/PlayCircle";
import PauseCircleIcon from "@mui/icons-material/PauseCircle";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CloseIcon from "@mui/icons-material/Close";
import AddIcon from "@mui/icons-material/Add";
import FlagIcon from "@mui/icons-material/Flag";
import Grid from "@mui/material/Grid";
import Checkbox from "@mui/material/Checkbox";
import { useAppSelector } from "@/lib/store/state.hook";
import ShortLink from "@/components/common/ShortLink";

export default function Personal() {
  const { todos, loading } = useAppSelector(s => s.todos)

  return (
    <>
      <div className="pb-4">
        <Grid container alignItems="center" justifyContent="center">
          <h2 className="text-[3rem] font-bold">01:15</h2>
          <Grid container alignItems="center" justifyContent="center" gap={2}>
            <IconButton color="success" size="large">
              <PlayCircleIcon fontSize="large" />
            </IconButton>
            <IconButton color="secondary" size="large">
              <PauseCircleIcon fontSize="large" />
            </IconButton>
          </Grid>
        </Grid>

        <div className="text-center">
          <Button
            variant="contained"
            className="!px-10"
            startIcon={<AddIcon />}
          >
            Add Work
          </Button>
        </div>
      </div>

      {todos.map(todo => (
        <div
          key={todo.id}
          className="py-2 mb-2 bg-slate-100 border-b border-s rounded overflow-hidden"
        >
          <Grid
            container
            alignItems="center"
            className="px-4 py-2 border-l-4 border-fuchsia-500"
            spacing={2}
          >
            <Grid item flex={1}>
              <ShortLink url={todo.reference} className="text-sm text-blue-500" />
              <div className="font-bold"><span className="uppercase text-fuchsia-500">{todo.project} |</span> {todo.title}</div>
            </Grid>
            <Grid item>
              <div className="font-bold text-green-700">{todo.time.format()}</div>
            </Grid>
          </Grid>
          <div className="mx-4 mt-2">
            {[1, 2, 3].map(j => (
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
