[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-8d59dc4de5201274e310e4c54b9627a8934c3b88527886e3b421487c677d23eb.svg)](https://classroom.github.com/a/vtMjwcap)
# hw2-handling-input-events
This is the starter code of [2023-Programming User Interface Homework](https://hackmd.io/@akairisu/HkUibgmx3)


# 姓名
- 羅寶瑩
- Po Ying, Law

# deploy 的網站連結
- 網站為hw1
- 請點擊**CREATE YOUR OWN**進入HW2的畫面
- https://bright-bublanina-402c50.netlify.app/

# 設計
separates the code for two types of devices, computer and mobile

## Computer
### Element - Click Actions
- There are three possible actions when performing **MouseDown** on an element:
    - Single-click
    - Double-click
    - Moving (Dragging)

- The determination method is as follows:
    - Single-click
        - If there is no **MouseMove** after **MouseDown**, the parameter `isMoving` is false. After **MouseUp**, if the mouse's position has not changed and `isMoving` is false, then it is a single-click.

    - Double-click
        - Use the **dblclick** event listener to determine the occurrence of a double-click.
    - Moving
        - If there is **MouseMove** after **MouseDown**, the parameter `isMoving` is true. It is determined as Moving after **MouseUp**.

### Element - Esc Interrupt Action
- If a double-click or moving occurs, create a **Keydown** listener. When it receives an event from the **Esc** key, the element returns to its original position and stops moving.


### Background - Deselect Action
- Perform an unselect action when performing **MouseDown** on the background. If the **MouseDown** position is in the `workspace`, then unselect the selected element.


## Mobile
### Element - Touch Actions
- There are three possible actions when performing **TouchStart** on an element:
    - Single tap
    - Double tap
    - Moving (Dragging)

- The determination method is as follows:
    - Single tap
        - Set a timer during the first tap. If there is no second tap within the timer's time, it is determined as a single tap.
        - At **touchend**, if it is not a double tap and the finger's movement range does not exceed 10px, it is a normal single tap (select).
        - (Please refer to the "有趣之處" section for the reasons behind the 10px judgement.)
    - Double tap
        - Set a timer during the first tap. If there is a second tap within the timer's time, it is determined as a double tap.
    - Single tap and move (Dragging)
        - If the finger's movement range exceeds 10px, and **touchmove** event triggers during movement, it is determined as moving.

### Element - Following Mode
- If following mode is turned on, the parameter `isFollowing` is true to maintain following. Create a **touchmove** listener for the document to obtain the element's new position until clicking the element again or using two fingers to stop.

### Element - Two-Finger Stop Action
- If a double tap or moving occurs and the element is moving, if it receives an action from two fingers, stop moving, and return to the position before the action.
- The determination method is as follows:
    - Use `isMoving` and `isFollowing` to determine whether the element is moving. If one of them is true and `event.touches.length` equals 2, stop the action.



### Background - Deselect Action
- Perform an unselect action when performing **touchstart** on the background. If the **touchstart** position is in the "workspace," then unselect it.

### Changing Element Size Action
- If an element is selected, you can touch the screen with two fingers and change the element's size by moving the two fingers.
    - The determination method is as follows:
        - If selectedelement is not null, then an element is selected.
        - The background event.touches.length is 2.
        - `isResizing` is true to record the resizing mode.
        
- Determine the element's size change by the distance between the two fingers. If the element's change is less than 20px, maintain a size of 20px.
    - The determination method is as follows:
        - Similar to the following code (incomplete code)
        - ![](https://i.imgur.com/NsypDdr.png)
- If one finger leaves, the size change will not be restored. If the finger returns, the resizing action will continue.
    - only **touchend** and three-finger actions can terminate the resize mode.
    
- If two fingers are resizing the element, touching the screen with the third finger will immediately stop the resizing action, and the element will return to its original size.
    - ![](https://i.imgur.com/MbORI11.png)



# 加分作業項目
- N/A

# 其他有趣之處
During the process of testing the mobile version of the assignment, I often faced difficulties in triggering single-tap actions due to slight shaking of my fingers. This was troublesome as it frequently caused incorrect events to be triggered or unnecessary events to occur. Therefore, I added a value (10px) to tolerate a little bit of finger shaking. And I checked if the displacement of the finger movement exceeded this value during each touch event.
