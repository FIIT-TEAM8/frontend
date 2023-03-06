import React, { useState, useEffect } from "react";
import {
  FormControl, Select, MenuItem, Box
} from "@mui/material";
import TextFlag from "../TextFlag";

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250
    }
  }
};

export default function MultipleSelect({ allItems, selectedItems, handleClick }) {
  const [all, setAll] = useState([]);
  const [selected, setSelected] = useState([]);

  useEffect(() => {
    setAll(allItems);
    setSelected(selectedItems);
  }, [allItems, selectedItems]);

  return (
    <FormControl fullWidth>
      <Select
        multiple
        value={selected}
        onChange={handleClick}
        MenuProps={MenuProps}
        renderValue={(renderSelected) => (
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
            {renderSelected.map((value) => (
              <TextFlag key={value} value={value} />
            ))}
          </Box>
        )}
      >
        {all.map((value) => (
          <MenuItem key={value} value={value}>
            {value}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}
