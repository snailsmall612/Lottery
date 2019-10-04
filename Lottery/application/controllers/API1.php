<?php

class API1 extends CI_Controller {

	public function query()
	{		
		header('Content-Type: application/json');
		//假設這邊回傳的資料是這個json
		echo'{
			  "result": {
			    "cache": 0,
			    "data": [
			      {
			        "gid": "'.strval($this->input->get('issue', TRUE)).'",
			        "award": "0,6,2,2,3",
			        "updatetime": "1567446006"
			      }
			    ]
			  },
			  "errorCode": 0
			}';
	}
}


?>
