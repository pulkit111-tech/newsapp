import React, { Component } from 'react'
import NewsItem from './NewsItem'
import PropTypes from 'prop-types'
import Spinner from './Spinner';
import InfiniteScroll from "react-infinite-scroll-component";
// we cant change the props they are read only but we can change the state so props se element lekr uski state change krdo is the best option
export class News extends Component {
  capital_first = (string) => {
    return string.charAt(0).toUpperCase()+string.slice(1);
  }
  constructor(props){
    super(props);
    console.log("Namaste Hindustan, I am a constructor")
    this.state = {
      articles: [],
      loading: false,  // it is true when we are extracting data in next or previous page
      page:1,
      totalResults:0
    }
    document.title = `${this.capital_first(this.props.category)} - NewsMonkey`;
  }
  async update(){
    const url = `https://newsapi.org/v2/top-headlines?country=${this.props.country}&category=${this.props.category}&apiKey=291c89617f6d466dbe98701923675160&page=${this.state.page}&pageSize=${this.props.pageSize}`;
        this.setState({loading: true});
        let data = await fetch(url);
  
        let parsedData = await data.json();
        console.log(parsedData);
        this.setState(
      {
        articles: parsedData.articles,
        totalResults: parsedData.totalResults,
        loading: false
      }
    )
  }
  async componentDidMount(){ // ye function render ke **bad hi** chlega or async await ke kaaran vo andar vale data ka wait krega
    this.update();
  }

  handleNext = async() =>{
      await this.setState({page:this.state.page+1});// idhr await lgana bht jruri hai vrna news bht khrab tarike se news glt tarike se populate hogi
      this.update();
  }
  handlePrev = async() =>{
      await this.setState({page:this.state.page-1}); // idhr await lgana bht jruri hai vrna news bht khrab tarike se news glt tarike se populate hogi
      this.update();
  }

  // fetchMoreData = async () => {
    // this.setState({page:this.state.page+1});
    // const url = `https://newsapi.org/v2/top-headlines?country=${this.props.country}&category=${this.props.category}&apiKey=291c89617f6d466dbe98701923675160&page=${this.state.page}&pageSize=${this.props.pageSize}`;
    //     this.setState({loading: true});
    //     let data = await fetch(url);
  
    //     let parsedData = await data.json();
    //     console.log(parsedData);
    //     this.setState(
    //   {
    //     articles: parsedData.articles,
    //     totalResults: this.state.articles.concat(parsedData.totalResults),
    //     loading: false
    //   }
    // )
  // };
  static defaultProps = {
    country: 'in',
    pageSize: 8,
    category: 'general'
  }
  static propTypes = {
    country: PropTypes.string,
    pageSize: PropTypes.number,
    category: PropTypes.string,
  }
  render() {
    return (
      <div className="container my-4">
          <h1 className="text-center"> NewsMonkey - Top {this.capital_first(this.props.category)} Headlines</h1>
           {/* {this.state.loading && <Spinner/>} this syntax is showing that if the loading is true then only show spinner */}
          <div className="container my-4">
          {/* <InfiniteScroll
          dataLength={this.state.articles.length}
          next={this.fetchMoreData()}
          hasMore={this.state.articles.length!==this.state.totalResults}
          loader={<Spinner/>} */}
        {/* > */}
            <div className="row my-6">
            {this.state.articles.map((element)=>{
              return <div className="col-md-4" key={element.url}>
                        <NewsItem  title={element.title?element.title.slice(0,25):" "} 
                        description={element.description?element.description.slice(0,88):" "} 
                        author={element.author}
                        date={element.publishedAt}              
                        imageUrl={element.urlToImage?element.urlToImage:"https://cdn.wionews.com/sites/default/files/styles/story_page/public/2020/09/02/157809-black-hole.jpg"} 
                        newsUrl={element.url}
                        source = {element.source.name}
                        />
                      </div>
                    }
                )
            }              
            </div>
            {/* </InfiniteScroll> */}
            </div>
          <div className="container d-flex justify-content-between">
              <button disabled={this.state.page<=1} type="button" className="btn btn-dark" onClick={this.handlePrev}>  &larr; Previous </button>
              
              <button disabled={this.state.page+1>Math.ceil(this.state.totalResults/this.props.pageSize)} type="button" className="btn btn-dark" onClick={this.handleNext}>  Next &rarr; </button>
          </div>
   </div>
    )
  }
}

export default News