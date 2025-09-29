import java.util.Arrays;
import java.util.Scanner;

public class Subarray {
    public static void main(String[] arg) {
        try (Scanner scanner = new Scanner(System.in)) {
            int total;
            int sub;
            int num1;
            int num2;

            total = scanner.nextInt();
            sub = scanner.nextInt();

            int[] mylist = new int[total];

            for (int i=0; i<total; i++) {
                mylist[i] = scanner.nextInt();
            }

            int k=0;
            for (int j=sub-1; j>1; j--) {     //REVERSING THE SUBARRAY
                num1 = mylist[j];
                while (k<sub-1) {
                    num2 = mylist[k];
                    mylist[k] = num1;
                    mylist[j] = num2;
                    k++;
                    break;
                }
            }

            int q=sub;
            for (int z=mylist.length-1; z>sub+1;z--) {   //REVERSING THE LAST ENTRIES
                num1 = mylist[z];
                while (q<mylist.length-1) {
                    num2 = mylist[q];
                    mylist[q] = num1;
                    mylist[z] = num2;
                    q++;
                    break;
                }
            }

            System.out.println(Arrays.toString(mylist));
        }
    }
}
