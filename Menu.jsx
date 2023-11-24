import React, { useState } from "react";
import { DragDropContext, Draggable } from "react-beautiful-dnd";
import { StrictModeDroppable as Droppable } from "../Helpers/DroppableProps";

const itemList = [
  [
    {
      id: "1",
      name: "IDLI",
      quantity: 9,
    },
    {
      id: "2",
      name: "Dosa",
      quantity: 4,
    },
    {
      id: "3",
      name: "Pongal",
      quantity: 29,
    },
  ],
  [
    {
      id: "13",
      name: "Upma Sambar",
      quantity: 58,
    },
    {
      id: "14",
      name: "Pongal Chutney",
      quantity: 67,
    },
    {
      id: "15",
      name: "Poori Channa ",
      quantity: 78,
    },
  ],
];

const Latest = () => {
  const [itemListState, setItemList] = useState(itemList);

  const getList = (droppableId) => {
    // console.log("getList ::droppableId", droppableId);
    let item_list = itemListState;
    let filtered_item = item_list.find(
      (tappedItem) => item_list.indexOf(tappedItem) == droppableId
    );
    // console.log("getList :: filtered_item", filtered_item);
    return filtered_item;
  };

  const getIndex = (droppableId) => {
    console.log("getIndex ::droppableId", droppableId);
    let item_list = itemListState;
    let findIndex = item_list.findIndex((tappedItem) => {
      console.log(tappedItem);
      return item_list.indexOf(tappedItem) == droppableId;
    });
    console.log("getIndex :: findIndex", findIndex);
    return findIndex;
  };

  const onDragEnd = (result) => {
    try {
      const { source, destination } = result;
      console.log("onDragEnd :: droppableId", result);
      // dropped outside the list
      if (!destination) {
        return;
      }
      console.log("onDragEnd :: getList 1", itemListState);
      let state_item_list = [...itemListState];

      if (source.droppableId === destination.droppableId) {
        let result_index = getIndex(source.droppableId);
        console.log("onDragEnd :: getList", getList(source.droppableId));
        let result_items = reorder(
          getList(source.droppableId),
          source.index,
          destination.index
        );
        console.log("onDragEnd :: result_items", result_items);
        state_item_list[result_index] = result_items;

        setItemList(state_item_list);
      } else {
        let result_source_index = getIndex(source.droppableId);
        let result_dest_index = getIndex(destination.droppableId);
        let result_m = move(
          getList(source.droppableId),
          getList(destination.droppableId),
          source,
          destination
        );
        if (
          result_m === undefined ||
          result_m.source === undefined ||
          result_m.dest === undefined
        ) {
          return;
        }
        state_item_list[result_source_index] = result_m.source;
        state_item_list[result_dest_index] = result_m.dest;
        console.log("@@Modified_Array", state_item_list);
        setItemList(state_item_list);
      }
    } catch (e) {
      console.log("onDragEnd ::  exception", e);
    }
  };

  const reorder = (list, startIndex, endIndex) => {
    console.log("reorder", list, startIndex, endIndex);
    let result = Array.from(list);
    let result_old = result[startIndex];
    let result_new = result[endIndex];
    result[startIndex] = result_new;
    result[endIndex] = result_old;
    console.log("reorder :: result", result);
    return result;
  };

  const move = (source, destination, droppableSource, droppableDestination) => {
    try {
      let result = {};

      console.log("move :: source :: destination", source, destination);
      console.log(
        "move :: droppableSource :: droppableSource",
        droppableSource,
        droppableDestination
      );
      let sourceClone = Array.from(source);
      let destClone = Array.from(destination);
      let first_item = sourceClone[droppableSource.index];
      let second_item = destClone[droppableDestination.index];
      console.log("move :: first_item", first_item);
      console.log("move :: second_item", second_item);
      if (first_item === undefined || second_item === undefined) {
        return;
      }
      sourceClone[droppableSource.index] = second_item;
      destClone[droppableDestination.index] = first_item;
      console.log("move :: source_new_obj", sourceClone);
      console.log("move :: dest_new_obj", destClone);
      result.source = sourceClone;
      result.dest = destClone;
      console.log("move :: dest_new_obj :: result", result);
      return result;
    } catch (e) {
      console.log("move ::  exception", e);
    }
  };

  console.log("itemList :: render", itemListState);

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      {itemListState.map((item, index) => (
        <Droppable
          droppableId={index.toString()}
          direction="vertical"
          key={index}
        >
          {(provided, snapshot) => (
            <div
              ref={provided.innerRef}
              style={getFirstListStyle(snapshot.isDraggingOver)}
              {...provided.droppableProps}
            >
              {item.map((item_row) => (
                <Draggable
                  key={item_row.id}
                  draggableId={item_row.id}
                  index={index}
                >
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      style={getItemStyle(
                        snapshot.isDragging,
                        provided.draggableProps.style,
                        item_row
                      )}
                    >
                      {item_row.name}-{item_row.quantity}
                    </div>
                  )}
                </Draggable>
              ))}
            </div>
          )}
        </Droppable>
      ))}
    </DragDropContext>
  );
};

const grid = 8;

const getFirstListStyle = (isDraggingOver) => ({
  background: isDraggingOver ? "lightblue" : "lightgrey",
  display: "flex",
  flexDirection: "column",
  padding: grid,
  width: 1000,
});

const getItemStyle = (isDragging, draggableStyle, item) => ({
  borderRadius: 10,
  height: 70,
  fontSize: 18,
  fontWeight: "bold",
  width: 500,
  padding: grid * 2,
  marginBottom: 10,
  marginRight: 10,
  background: "aqua",
  ...draggableStyle,
});

export default Latest;
