
export const useFromErrorsProviver = (httpError) => {

    let errors = [];

    if (httpError.statusCode === 422) {

        const data = httpError?.response?.data;
        const violations = data?.violations || [];


        for (let i in violations) {
            const violation = violations[i];
            const name = violation.propertyPath;
            const message = violation.message;

            if (errors.findIndex(e => e.name === name) !== -1) {
                errors[errors.findIndex(e => e.name === name)].errors.push(message)
            } else {

                let list = name.split('.');
                let nameList = [];
                
                if (list.length > 1) {

                    for (let i in list) {
                        let item = list[i];
                        let values = item.split(/\[[0-9]+\]/gm);
                        let pos = item.match(/\[[0-9]+\]/gm);
                        
                        nameList.push(values[0]);
                        
                        if (pos) {
                            pos = pos[0].replace('[', '');
                            pos = pos.replace(']', '');
                            nameList.push(parseInt(pos));
                        }                        
                    }

                }

                errors.push(
                    {
                        name: nameList.length > 0 ? nameList : name,
                        errors: [message]
                    }
                );
            }
        }
    }

    return errors;

}