<?php

class API2 extends CI_Controller {

	public function query()
	{		
		header('Content-Type: application/json');
		//假設這邊回傳的資料是這個json
		echo'{
			  "rows": 1,
			  "code": "'.strval($this->input->get('code', TRUE)).'",
			  "data": [
			    {
			      "expect": "'.strval($this->input->get('expect', TRUE)).'",
			      "opencode": "0,6,2,2,3",
			      "opentime": "2019-09-02 01:12:46"
			    }
			  ]
			}';
	}
}


?>
