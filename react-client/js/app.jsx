var Student = React.createClass({
    getInitialState: function(){
        //return {}
        return {
            show: "",
            _id: this.props.dataprop._id,
            firstName: this.props.dataprop.firstName,
            lastName: this.props.dataprop.lastName,
            age: this.props.dataprop.age,
            email: this.props.dataprop.email
        }
    },
    // handleClick is not a default lifecycle event, can have a different name
    handleClick: function () {
        //console.log("clicked")
        var ReactThis = this; // to pass StudentList in axios function, solve scope problem
        axios.get('http://localhost:3000/student/' + this.props.dataprop._id)
            .then(function (response) {
                ReactThis.setState({
                    show: "yes",
                    firstName: response.data.firstName,
                    lastName: response.data.lastName,
                    age: response.data.age,
                    email: response.data.email
                }); // response.data is an object
            })
            .catch(function (error) {
                console.log(error)
            })
    },
    handleBack: function(){
                this.setState({
                    show: ""
                });
    },
    handleChange: function (event) {
        var studentObj = this.state;
        studentObj[event.target.name] = event.target.value;
        this.setState(this.state);
    },
    handleSubmit: function (event) {
        event.preventDefault();
        var reqBody = {
            firstName: this.state.firstName,
            lastName: this.state.lastName,
            age: this.state.age,
            email: this.state.email
        }
        var ReactThis = this;
        axios.post('http://localhost:3000/update/' + this.props.dataprop._id, reqBody)
            .then(function (response) {
                ReactThis.setState({
                    show: ""
                });
            })
            .catch(function (error) {
                console.log(error)
            })
    },
    handleDelete: function(){ //TODO: function in props
        var ReactThis = this;
        var studentobject = this.state;
        event.preventDefault();
        // console.log("delete");
        axios.post('http://localhost:3000/delete/' + this.props.dataprop._id)
            .then(function (response) {
                ReactThis.props.updatelist(studentobject);
                //console.log(response)
            })
            .catch(function (error) {
                console.log(error)
            })
    },
    // every module can have a render function
    render: function(){
        // test return <h5>Yuefan Liu</h5>
        // dataprop is passed in by StudentList, which is the "parent component"
        // dataprop is an object, and .firstname gets it's firstname
        // return <h3 onClick={this.handleClick}>{this.props.dataprop.firstName}</h3>
        if (this.state.show) {
            // var nameNode = (
            //     <div>
            //         <h3>firstname: {this.state.firstName}</h3>
            //         <h3>lastname: {this.state.lastName}</h3>
            //         <h3>age: {this.state.age}</h3>
            //         <h3>Email: {this.state.email}</h3>
            //         <h4 onClick={this.handleBack}>Hide Detail</h4>
            //     </div>
            // )
            var nameNode = (
                <div>
                    <h3>firstname: {this.state.firstName}</h3>
                    <h3>lastname: {this.state.lastName}</h3>
                    <h3>age: {this.state.age}</h3>
                    <h3>Email: {this.state.email}</h3>
                    <form action="#" onSubmit={this.handleSubmit}>
                        <input type="text" name="firstName" value={this.state.firstName} placeholder="first name" onChange={this.handleChange}/>
                        <input type="text" name="lastName" value={this.state.lastName} placeholder="last name" onChange={this.handleChange}/>
                        <input type="text" name="age" value={this.state.age} placeholder="age" onChange={this.handleChange}/>
                        <input type="text" name="email" value={this.state.email} placeholder="email" onChange={this.handleChange}/>
                        <h4 onClick={this.handleBack}>Hide Detail</h4>
                        <button>Update</button>
                    </form>
                </div>
            )
        } else {
            var nameNode = (
                <div class="tr">
                    <h3 class="td" onClick={this.handleClick}>{this.state.firstName}</h3>
                    <div>
                        <button class="td" onClick={this.handleDelete}>Delete</button>
                    </div>
                </div>
            )
        }
        return (
            <div>
                {nameNode}
                <hr/>
            </div>
        )
    }
});

var StudentFrom = React.createClass({
    getInitialState: function(){
        return {
            firstName: "",
            lastName: "",
            age: "",
            email: ""
        }
    },
    handleSubmit: function (event) {
        var ReactThis = this;
        var studentobject = this.state;
        event.preventDefault();// prevent default submission and page refresh
        //console.log(this.state)
        axios.post('http://localhost:3000/new', this.state)
            .then(function (response) {
                //TODO: call addstudent function in props
                //ReactThis.props.addstudent(studentobject);
                console.log(response)
            })
            .catch(function (error) {
                console.log(error)
            })
    },
    handleChange: function (event) {
        // console.log(event.target.value)
        var studentObj = this.state;
        // event.target.name = current changing element (event target), get by it's name
        // use name as a key and value as value
        studentObj[event.target.name] = event.target.value;
        this.setState(this.state);
    },
    render: function(){
        return (
            <form action="#" onSubmit={this.handleSubmit}>
                <input type="text" name="firstName" placeholder="first name" onChange={this.handleChange}/>
                <input type="text" name="lastName" placeholder="last name" onChange={this.handleChange}/>
                <input type="text" name="age" placeholder="age" onChange={this.handleChange}/>
                <input type="text" name="email" placeholder="email" onChange={this.handleChange}/>
                <button>Submit</button>
            </form>
        )
    }
})

var StudentList = React.createClass({
    getInitialState: function(){
        return {
            studentList: [] // this is a state, one component can have many states
        }
    },
    //

    // when student has mounted into html (actural dom) from virtual dom,
    // put data in studentList object
    componentDidMount: function () {
        // example:
        // this.setState({
        //     studentList: [
        //         {firstname: Karen, age: 22},
        //         {firstname: Mei, age: 28}
        //     ]
        // })
        // use third-party library axios to do "get" [add script]
        var ReactThis = this; // to pass StudentList in axios function, solve scope problem
        axios.get('http://localhost:3000/student')
            .then(function (response) {
                ReactThis.setState({
                    studentList: response.data
                })
            })
            .catch(function (error) {
                console.log(error)
            })
    },
    removeFromList: function(obj){
        // remove obj from studentlist and update
        var oldList = this.state.studentList
        var newList = oldList.filter(function(student){
            return student._id !== obj._id;
        })
        this.setState({
            studentList: newList
        })
    },
    addToList: function(obj){
        // remove obj from studentlist and update
        var list = this.state.studentList
        list.push(obj);
        this.setState({
            studentList: list
        })
    },
    render: function () {
        // test: return <h1>Student List Render</h1>
        // <Student student="Yuefan Liu"/> student="" is a props, usually an object, not a string
        // example: hard coded
        // return(<div>
        //      <Student student="Yuefan Liu"/>
        //      <h5>Joe Hu</h5>
        // </div>)
        var ReactThis = this;
        return (<div>
            {   // this = this component = StudentList
                // .state = possible states in StudentList
                // .studentList get the studentList state,
                // which is an array, having two hard-coded object in it at current time
                // .map has function as for loop
                this.state.studentList.map(
                    function(studentObject) {

                        // dataprop is a prop, being "passed" into Student component
                        return <Student dataprop={studentObject}
                                        key={studentObject._id}
                                        updatelist={ReactThis.removeFromList}
                        />
                    }
                )
            }
            <StudentFrom addstudent={ReactThis.addToList} key="studentform" />
        </div>)
    }
})



ReactDOM.render(
    // initial render
    // every change/update will "trigger" a render
    // <h2>Hello React</h2>, document.getElementById('app')
    // insert <h2>Hello React</h2> into element document.getElementById('app')
    <StudentList/>, document.getElementById('app')
);