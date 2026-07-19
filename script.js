const form = document.querySelector('#to-do-form');
const addTaskBtn = document.querySelector('#addTaskBtn');
const display = document.querySelector('#display');
const displayContainer = document.querySelector('.display-container');
const taskElement = document.querySelector("#task-input");
// Delete ALL tASks button that make array empty and update storage 
const deltAllBtn = document.querySelector('#clearAll');


// To update & save tasks in browser
let toDoArray = [];

 
//function To save array of tasks into local
function saveToLocal(tdarray){
    localStorage.setItem('myTasks', JSON.stringify(tdarray));
}

// creating list element to put in while rendering task
const createTaskListElement = (text)=>{

    // CREATE LIST, Append P and button inside it
    const li = document.createElement('li');
    const p = document.createElement('p');
    const btn = document.createElement('button');
    // Set TAsk text in p
    p.innerText = text;
    // HAve tick for delete in button
    btn.innerHTML = "&#10004;";
    
    btn.classList.add('delete-button');

    // btn.addEventListener('click', removeTask)
    

    // Finally Append both in list
    li.append(p, btn);
    li.classList.add('listrow'); //for making it in row

    // Returns li tag
    return li;


}

// THIS ADD IN DOM
function renderTask(text){
    // display.append(task);
    console.log("See Sushil")



    // Created new task inside li tag
    const newTask = createTaskListElement(text);

    // Finally Add TASK as li
    display.prepend(newTask);




    // A tiny 10ms pause gives the DOM time to render before animating
    // For TRANSITION EFFFECT
    setTimeout(()=>{
        newTask.classList.add('show');
    }, 10);

}


// THIS ADD IN ARRAY AND STORAGE
function addTask(text){
    
    // Put task in Array of JS and that array in Local storage Browser, always put at last because when array will render then toDoList renders every element at first position, so last element of array must be at upper, thats why
    toDoArray.push(text);
    saveToLocal(toDoArray);

}

// Adding listener to form to render and update new task
form.addEventListener('submit', (e)=>{
    e.preventDefault();
    // console.log(e.type);
    // console.log(e.target);

    const taskText = taskElement.value;
    if(taskText == "")
        alert("Input cannot be empty. Enter Task");
    else{

        addTaskBtn.classList.add('active'); 
        //this transition takes 100 seconds, so after 150 seconds below will be executed
        
        
        setTimeout(()=>{
            
            
                    // FIX FOR MOBILE: Dismisses the virtual keyboard instantly
                    if (document.activeElement) {
                        document.activeElement.blur();    //blur();  is opposite of focus(), when input field active(means focus) keyboard displays, blur remove focus from activeelemnt input field and so OS of mobile remove keyboard 
                    }

                    
                    
                    
                    // Render Task in DOM
                    renderTask(taskText);
                    
                    //Add in array and storage
                    addTask(taskText);
                    
                    checkEmptyState();
                    
            
                    // As display gets scroll up at top when new task is added
                    display.scrollTo({
                        top:0,
                        behavior: "smooth"
                        
                    })
                    console.log(toDoArray);
                    taskElement.value = "";


                    addTaskBtn.classList.remove('active'); 

        }, 150)

    }

    
    

})



// TASKS REMOVAL FUNTION---INCLUDE both individual removal and all at once
const removeTask =(e)=>{

    // console.log("Delete Button Clicked");
    // console.log(e.target," is clicked");
    const clickedBtn = e.target;

    // So only delete button will be clicked not other elements inside parent 'display'
    if( clickedBtn.classList.contains('delete-button')){


        li_ToDelete = clickedBtn.parentElement


        // So that after button clicked we can at
        setTimeout(()=>{

            //Make list margin, padding 0 means invisible/hidden state when 'show' class removed
            li_ToDelete.classList.remove('show');
            clickedBtn.innerHTML = "";
            
        }, 400)
        
        // wait for TRANSITION completion BEFORE REMOVING completly
        setTimeout(()=>{  
            
            // Completely remove list element after some time
            clickedBtn.parentElement.remove();
            checkEmptyState(); //So that button exists
        }, 700);   //as css transition have 0.3s 300ms time 

        // Grab text of task to delete from array, and save array updated to local
        taskToDelete = clickedBtn.parentElement.querySelector('p').innerText;

        // USING Filter method
        // toDoArray = toDoArray.filter(text => {
        //     return text!=taskToDelete;
        // })

        // USING .indexOf() and .splice() operators
        const taskIndex = toDoArray.indexOf(taskToDelete);
        toDoArray.splice(taskIndex, 1); //delete 1 element, starting from that index

        // After deleting element update array into local storage
        saveToLocal(toDoArray);
    }
    // IN CASE ITS CLEAR ALL BUTTON
    else if(clickedBtn.id == "clearAll"){

           // 1. Grab EVERY single task currently rendered on the screen
        const allCurrentTasks = display.querySelectorAll('.listrow');

        // 2. Loop through all of them and pull off their invisibility cloak (.show)
        allCurrentTasks.forEach((liItem) => {
            liItem.classList.add('collapse'); //collapse right
        });
             
        
        // TRANSITION BEFORE REMOVING
        setTimeout(()=>{  
            display.innerHTML = "";
            toDoArray.length = 0;
            saveToLocal(toDoArray);
            checkEmptyState();
        }, 300); 
        
        
        console.log(toDoArray)
    }
}

// ADDED Event listenar to parent container--means Event delegation
displayContainer.addEventListener('click', removeTask);


// ON PAGE RELOAD self invoked function
(function pageReload(){

    if(localStorage.getItem('myTasks')){
        toDoArray = JSON.parse(localStorage.getItem('myTasks'));
    }
    
    if(toDoArray.length > 0){

        toDoArray.forEach(taskText => {
            renderTask(taskText)
        });
    }
    
    
    
})();

// CHECKS IF ARRAY or STORAGE is EMPTY and below runs
function checkEmptyState(){

    const emptyTaskBtn = document.querySelector("#emptyTaskBtn"); //Instead of creating access by id, if exists then get

    if(toDoArray.length === 0){

        if(!emptyTaskBtn){  //Only creates if not exists

            const emptyTaskBtn = document.createElement("button");
            emptyTaskBtn.id = "emptyTaskBtn";
            emptyTaskBtn.textContent = "Click to Add Tasks";
            display.append(emptyTaskBtn);
            display.classList.add('center');
            
            // It does focus on input when clicked
            emptyTaskBtn.addEventListener('click', ()=>{
                form.querySelector('input').focus();
            })
            
        }
        
        
    }else{ //when array has tasks
        if (emptyTaskBtn){
            display.classList.remove('center');
            emptyTaskBtn.remove();
        }

    }
    
}


//Runs after page reloads also  ///It should also run after each task removed, or clear ALL
checkEmptyState();



// localStorage.clear();
//location.reload() ---reloads page

