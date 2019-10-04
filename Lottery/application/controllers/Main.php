<?php

class Target{

	private $lottery;
	private $mainSource;
	private $gameId_mainSource_mapping = [
	    1 => "http://localhost/Lottery/index.php/API1/query?gamekey={gamekey}&issue={issue}",   //假設這是題目中說的API 1 url: http://one.fake/v1?gamekey={gamekey}&issue={issue}    
	    2 => "http://localhost/Lottery/index.php/API2/query?code={gamekey}&expect={issue}"  //假設這是題目中說的API 2 url: https://two.fake/newly.do?code={gamekey}    
	];

	private $source_gameId_mapping = [
		"http://localhost/Lottery/index.php/API1/query" => [1 => "ssc", 2 => "bjsyxw"],
		"http://localhost/Lottery/index.php/API2/query" => [1 => "cqssc", 2 => "bj11x5"]
	];

	private $source_parse_result_rule_mapping = [
		"http://localhost/Lottery/index.php/API1/query" => '$response_json = json_decode($response, true); $mainSource_winning_numbers = $response_json["result"]["data"][0]["award"];',
		"http://localhost/Lottery/index.php/API2/query" => '$response_json = json_decode($response, true); $mainSource_winning_numbers = $response_json["data"][0]["opencode"];'
	];

	public function __construct(Lottery $lottery)
    {	
    	$this->lottery = $lottery;
    }

    private function requestToGetWinningNumber($reqURL){
    	//根據api url和彩種找到對應的彩種編號
    	$apiURL = explode("?", $reqURL)[0];
    	$gameKey = $this->source_gameId_mapping[$apiURL][$this->lottery->getGameId()];
    	//根據api url和彩種找到對應的彩種編號



    	//組出送http get request的url
    	$reqURL = str_replace("{gamekey}", $gameKey, $reqURL);
    	$reqURL = str_replace("{issue}", $this->lottery->getIssue(), $reqURL);
    	//組出送http get request的url



		
  		echo "Submit http get request to 「".$reqURL."」 for retrieve data...<br>";
  		$response = file_get_contents($reqURL); //do http get request to get data...
  		echo "response=" . $response . "<br>";
  		$mainSource_winning_numbers = "";


  		$parse_result_code = $this->source_parse_result_rule_mapping[$apiURL]; //根據api url 選擇parse response的rule
  		eval($parse_result_code); //執行parse result的程式碼


  		echo "開獎號碼 = " . $mainSource_winning_numbers . "<br>";
  		echo "-------------------------------------------------------------<br>";
  		return $mainSource_winning_numbers;
    }
	
	public function getWinningNumber(){
		$return_winning_numbers = "無法確認中獎號碼";

		$this->mainSource = $this->gameId_mainSource_mapping[$this->lottery->getGameId()];  //根據彩種找到主號源
		echo "主號源API url: " . $this->mainSource . "<br>";
		$mainSource_winning_numbers = $this->requestToGetWinningNumber($this->mainSource);



  		//從其他副號源搜尋是否有任一個開獎號碼跟主號源一樣
  		echo "從其他副號源搜尋是否有任一個的開獎號碼跟主號源一樣! <br>";
  		foreach ($this->gameId_mainSource_mapping as $gameId => $sourceUrl) {
  			if($gameId != $this->lottery->getGameId()){ //不等於主號源	
  				$winning_numbers = $this->requestToGetWinningNumber($sourceUrl);
  				if($winning_numbers == $mainSource_winning_numbers){  //任一副號源開獎號碼=主號源, 即算成功
  					$return_winning_numbers = $winning_numbers;
  					break;
  				}
  			}
  		}
  		//從其他副號源搜尋是否有任一個開獎號碼跟主號源一樣
  		return $return_winning_numbers;
	}
}


class Lottery {
	private $gameId; //彩種
	private $issue; //期號
	private $winning_number;

	public function setGameId($gameId){
		$this->gameId = $gameId;
	}

	public function setIssue($issue){
		$this->issue = $issue;
	}

	public function getGameId(){
		return $this->gameId;
	}

	public function getIssue(){
		return $this->issue;
	}

	public function update($result){
		$this->winning_number = $result;
	}

	public function get_winning_number(){
		return $this->winning_number;
	}
}

class UpdateWinningNumberJob {

	protected $lottery;

	public function __construct(Lottery $lottery)
    {
    	 $this->lottery = $lottery;
        // Do something with $params
    }

    public function handle()
    {	
    	
        try {
            $target = new Target($this->lottery); 
            $this->lottery->update($target->getWinningNumber());
            echo("開獎號碼: " . $this->lottery->get_winning_number());
        } catch (FetchFailureException $e) {
            Log::error('Something went wrong.');
        }
    }
}

class Main extends CI_Controller {

	public function start($page = 'home')
	{

		echo "gameId=1 => 重慶時時彩<br>";
		echo "gameId=2 => 北京11選5<br>";
		echo "-------------------------------------------------------------<br>";

		$lottery = new Lottery();
		$lottery->setGameId((int)($this->input->get('gameId', TRUE)));
		$lottery->setIssue(strval($this->input->get('issue', TRUE)));



		(new UpdateWinningNumberJob($lottery))->handle();
		//$this->load->library('UpdateWinningNumberJob', $lottery);
		
		//$this->UpdateWinningNumberJob->handle();
		/*
		if ( ! file_exists('application/views/pages/'.$page.'.php'))
		{
			// 哇勒!我們沒有這個頁面!
			show_404();
		}
		
		
		$data['title'] = ucfirst($page); // 第一個字母大寫
		
		
		$this->load->helper('url');
		$this->load->view('templates/header', $data);
		$this->load->view('pages/'.$page);
		$this->load->view('templates/footer');
		*/
		
	}
}


?>
